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
  return readFileSync(join(ROOT, "prompts", "tax-audit-prompt.md"), "utf-8");
}

// ---------------------------------------------------------------------------
// 2. Build the user message
// ---------------------------------------------------------------------------

function buildUserMessage(context: Record<string, string>): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contextBlock = Object.entries(context)
    .map(([file, content]) => `## ${file}\n\n${content}`)
    .join("\n\n---\n\n");

  return `Today is ${today}.

${contextBlock}

---

Generate a structured tax audit. Cover each of these sections in order, lead with the highest-value action with a real deadline:

**UNCLAIMED CREDITS:** AMT credit carryforward status (Form 8801). For each amendable year, state the original filing due date, the 3-year statute deadline, and the estimated credit recoverable via Form 1040-X. Flag the earliest deadline first.

**CARRYFORWARD UTILIZATION:** Existing direct-indexing TLH capital loss carryforward and any prior-year capital loss carryforward on Schedule D. State the dollar amount, the character (short-term vs. long-term if known), and the recommended order of use against the next realized gain. Lowest opportunity cost first.

**HARVESTABLE LOSSES:** Positions currently underwater (unrealized losses) that could be sold to offset realized or anticipated gains this tax year. Distinguish realized vs. unrealized. For each, state ticker, account, current unrealized loss, and what gain it would pair with.

**WASH SALE RISK:** Cross-reference taxable brokerage holdings against any direct-indexing account that runs automated TLH. Flag any position that would create a wash sale issue under IRC 1091 if sold at a loss. Specifically check the direct-indexing basket for substantially identical securities to anything in the main brokerage.

**ROTH CONVERSION WINDOW:** Conversion math for the current low-income year. State the bracket headroom, recommended conversion size, and the December 31 deadline. Coordinate with any planned gain harvesting since conversions add to ordinary income and can push LTCG out of the 0% bracket.

**GAIN/LOSS PAIRING RECOMMENDATIONS:** Look at GOALS_AND_RULES.md and DECISIONS.md. Any sale, rebalance, or options-assignment risk the wealth manager has flagged that would realize a gain? If yes, pair it with a specific available loss and quantify the net tax impact.

**DECISIONS.MD CROSS-REFERENCE:** Walk through the last 12 months of decisions. Flag any that still need tax follow-up: a Q1 sale that needs Schedule D treatment, an options assignment that changed basis, a Roth conversion that needs Form 8606 filed, a 1099-B reconciliation, anything that affects the upcoming return.

**TOP 1-3 ACTIONS RANKED:** Dollar-quantified, with deadlines and form numbers. Be direct.

End with "Nothing else needs action this quarter" if that's the case.`;
}

// ---------------------------------------------------------------------------
// 3. Call Anthropic API with prompt caching
// ---------------------------------------------------------------------------

async function generateAudit(
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
// 4. Send email via Resend
// ---------------------------------------------------------------------------

async function sendEmail(audit: string): Promise<void> {
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
    subject: `Tax Audit -- ${today}`,
    text: audit,
    html: auditToHtml(audit),
  });

  console.log(`[Email] Sent to ${to}`);
}

function auditToHtml(markdown: string): string {
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
  console.log("=== Financial OS -- Tax Audit ===\n");

  console.log("[1/3] Reading context files...");
  const context = readContextFiles();
  const systemPrompt = readSystemPrompt();

  console.log("[2/3] Generating tax audit via Anthropic API...");
  const userMessage = buildUserMessage(context);
  const audit = await generateAudit(systemPrompt, userMessage);

  console.log("\n" + "=".repeat(60));
  console.log(audit);
  console.log("=".repeat(60) + "\n");

  console.log("[3/3] Sending email...");
  await sendEmail(audit);

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
