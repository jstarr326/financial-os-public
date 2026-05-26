import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. Read context files
// ---------------------------------------------------------------------------

function readContextFiles(): Record<string, string> {
  const files = [
    "FINANCIAL_OVERVIEW.md",
    "GOALS_AND_RULES.md",
    "TAX_CONTEXT.md",
    "DECISIONS.md",
  ];
  const context: Record<string, string> = {};
  for (const file of files) {
    const path = join(ROOT, "context", file);
    context[file] = readFileSync(path, "utf-8");
  }
  return context;
}

function readSystemPrompt(): string {
  return readFileSync(join(ROOT, "prompts", "system-prompt.md"), "utf-8");
}

// ---------------------------------------------------------------------------
// 2. Fetch S&P 500 market data
// ---------------------------------------------------------------------------

interface MarketData {
  price: number;
  fiftyTwoWeekHigh: number;
  drawdownFromHigh: number;
  drawdownPercent: number;
  previousClose: number;
  dailyChange: number;
  dailyChangePercent: number;
}

async function fetchSP500(): Promise<MarketData> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?range=5d&interval=1d";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) throw new Error(`Yahoo Finance API returned ${res.status}`);

  const data = (await res.json()) as {
    chart: {
      result: [
        {
          meta: {
            regularMarketPrice: number;
            fiftyTwoWeekHigh: number;
            chartPreviousClose: number;
          };
        },
      ];
    };
  };

  const meta = data.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const high = meta.fiftyTwoWeekHigh;
  const prevClose = meta.chartPreviousClose;

  return {
    price,
    fiftyTwoWeekHigh: high,
    drawdownFromHigh: high - price,
    drawdownPercent: ((high - price) / high) * 100,
    previousClose: prevClose,
    dailyChange: price - prevClose,
    dailyChangePercent: ((price - prevClose) / prevClose) * 100,
  };
}

// ---------------------------------------------------------------------------
// 3. Build the user message
// ---------------------------------------------------------------------------

function buildUserMessage(
  context: Record<string, string>,
  market: MarketData,
): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const marketBlock = `
## Live Market Data (${today})

S&P 500: ${market.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
52-Week High: ${market.fiftyTwoWeekHigh.toLocaleString("en-US", { minimumFractionDigits: 2 })}
Distance from 52-Week High: -${market.drawdownPercent.toFixed(2)}% (-${market.drawdownFromHigh.toFixed(2)} points)
Daily Change: ${market.dailyChange >= 0 ? "+" : ""}${market.dailyChangePercent.toFixed(2)}% (${market.dailyChange >= 0 ? "+" : ""}${market.dailyChange.toFixed(2)} points)
Previous Close: ${market.previousClose.toLocaleString("en-US", { minimumFractionDigits: 2 })}
`.trim();

  const contextBlock = Object.entries(context)
    .map(([file, content]) => `## ${file}\n\n${content}`)
    .join("\n\n---\n\n");

  return `${marketBlock}

---

${contextBlock}

---

Generate my weekly financial briefing. Cover each of these sections:

**PORTFOLIO SNAPSHOT:** Total net worth, change from last week if available, top movers in my positions.

**ALLOCATION CHECK:** Current allocation vs targets from GOALS_AND_RULES.md. Flag any asset class that has drifted more than 5% from target midpoint (Rule #5).

**RULE STATUS:** For each mechanical rule in GOALS_AND_RULES.md, check whether the trigger condition is currently met:
- Rule 1: Is S&P 500 down 10%+ from ATH? If yes, calculate the deployment amount.
- Rule 2: Is S&P 500 down 20%+ from ATH? If yes, calculate the additional deployment.
- Rule 3: Any T-bill maturities in the next 30 days? What are the amounts and what do my rules say to do?
- Rule 4: Monthly DCA floor -- have I deployed at least the floor amount this month? (Check DECISIONS.md for recent deployments.)
- Rule 7: Did the market have a 3%+ up day today? If yes, flag as a do-not-deploy day.
- Rule 10: Any 3%+ down days recently? If yes, flag as buying opportunity.

**CASH & BURN RATE:** Checking balance vs monthly burn rate. How many months of runway in checking? Flag if less than 2 months.

**TAX OPPORTUNITIES:** Any unrealized losses worth harvesting? Any gains that could be paired with available losses for tax-free rebalancing? Roth conversion window reminder if still in low-income year.

**OPTIONS REVIEW:** Current open options positions. Are any approaching expiration within 14 days? What's the status (in/out of the money based on current prices)?

**RECOMMENDED ACTIONS:** Rank the top 1-3 things I should do this week, with specific dollar amounts and tickers. Be direct.`;
}

// ---------------------------------------------------------------------------
// 4. Call Anthropic API with prompt caching
// ---------------------------------------------------------------------------

async function generateBriefing(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userMessage,
            cache_control: { type: "ephemeral" },
          },
        ],
      },
    ],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const usage = response.usage as unknown as Record<string, number>;
  console.log(
    `\n[API Usage] Input: ${usage.input_tokens} tokens (${usage.cache_read_input_tokens ?? 0} cached), Output: ${usage.output_tokens} tokens\n`,
  );

  return text;
}

// ---------------------------------------------------------------------------
// 5. Send email via Resend
// ---------------------------------------------------------------------------

async function sendEmail(briefing: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.log(
      "[Email] Skipping -- RESEND_API_KEY, EMAIL_TO, or EMAIL_FROM not set",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  await resend.emails.send({
    to,
    from,
    subject: `Financial Briefing -- ${today}`,
    text: briefing,
    html: briefingToHtml(briefing),
  });

  console.log(`[Email] Sent to ${to}`);
}

function briefingToHtml(markdown: string): string {
  // Lightweight markdown-to-HTML: headers, bold, lists, line breaks
  return (
    `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #1a1a1a;">` +
    markdown
      .replace(/^### (.+)$/gm, '<h3 style="margin-top: 24px;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="margin-top: 32px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="margin-top: 32px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.+)$/gm, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left: 20px;">$&</ul>')
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>") +
    `</div>`
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Financial OS -- Weekly Briefing ===\n");

  console.log("[1/4] Reading context files...");
  const context = readContextFiles();
  const systemPrompt = readSystemPrompt();

  console.log("[2/4] Fetching S&P 500 data...");
  const market = await fetchSP500();
  console.log(
    `  S&P 500: ${market.price.toFixed(2)} | 52wk High: ${market.fiftyTwoWeekHigh.toFixed(2)} | From High: -${market.drawdownPercent.toFixed(1)}% | Today: ${market.dailyChangePercent >= 0 ? "+" : ""}${market.dailyChangePercent.toFixed(2)}%`,
  );

  console.log("[3/4] Generating briefing via Anthropic API...");
  const userMessage = buildUserMessage(context, market);
  const briefing = await generateBriefing(systemPrompt, userMessage);

  console.log("\n" + "=".repeat(60));
  console.log(briefing);
  console.log("=".repeat(60) + "\n");

  console.log("[4/4] Sending email...");
  await sendEmail(briefing);

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
