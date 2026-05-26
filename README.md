# Financial OS

A personal AI financial advisory layer that unifies accounts, enforces investment rules, and surfaces tax-optimized actions. It connects to brokerage data via MCP, maintains persistent context in structured markdown files, and uses the Anthropic API to generate weekly briefings that check mechanical investment rules against live market conditions. The system knows positions, cost basis, tax situation, and goals, so it produces specific advice with dollar amounts and tickers instead of generic guidance.

> This repo is a public, redacted version of a private system I use weekly. The architecture, code structure, and sample outputs reflect the real system; personal account details, tax data, and positions have been anonymized.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Advisory Layer                         │
│        Anthropic API + weekly briefing script            │
│   Checks rules, flags tax moves, recommends actions     │
├─────────────────────────────────────────────────────────┤
│                  Context Layer                           │
│     Persistent markdown files (positions, goals,         │
│     tax situation, decision history)                     │
├─────────────────────────────────────────────────────────┤
│                   Data Layer                             │
│   Monarch Money MCP (Schwab, Wealthfront, Coinbase,     │
│   BofA, credit cards) + Yahoo Finance (S&P 500)         │
└─────────────────────────────────────────────────────────┘
```

**Data Layer.** Monarch Money MCP provides positions, cost basis, and balances across taxable brokerage, retirement accounts, direct-indexing accounts, crypto, banking, and credit cards. Yahoo Finance for S&P 500 quotes and 52-week-high tracking. TreasuryDirect and private investments are manual entries in markdown because no API exists.

**Context Layer.** Four markdown files encode everything the AI needs beyond the numbers. The structure is documented in the example files under `/context/`:

- `FINANCIAL_OVERVIEW.md` -- portfolio snapshot, positions, cost basis, allocation vs. targets, options positions, tax assets, data-source status
- `GOALS_AND_RULES.md` -- target allocation by asset class, investment philosophy, behavioral patterns, and the 10 mechanical pre-committed rules
- `TAX_CONTEXT.md` -- filing history, carryforwards, AMT credits, Roth conversion math, state tax planning
- `DECISIONS.md` -- running journal of buy/sell decisions, reasoning, what the system recommended, outcomes

**Advisory Layer.** A TypeScript script (`scripts/daily-briefing.ts`) reads all four context files, fetches live S&P 500 data, calls Claude via the Anthropic API with prompt caching on both the system prompt and the context block, and returns a structured weekly briefing. Output is emailed via Resend.

## What's built

- Monarch MCP integration providing live positions and cost basis across all connected accounts
- Weekly briefing via `npm run briefing` that generates analysis and emails it
- S&P 500 drawdown tracking against 52-week high for the mechanical rule triggers
- Full allocation calculation across all accounts with drift detection
- Tax opportunity flagging (unrealized losses, Roth conversion window, gain/loss pairing)
- Options position monitoring with expiration alerts
- Knowledge base under `/knowledge/` documenting MCP quirks so they don't have to be rediscovered every session

## What isn't built

- Any UI. Interface is the emailed briefing, or chatting with a Claude Project that has the markdown files loaded
- Direct broker MCP (community Schwab MCP exists but isn't connected here) -- would unlock lot-level cost basis for true tax-loss harvesting
- Event-triggered alerts (currently only weekly cadence). Should fire on 3%+ down days and T-bill maturities, not just on schedule
- Investment literature RAG (Bogle, Bernstein, Swensen, Malkiel)
- Coinbase MCP and direct Wealthfront automation
- Multi-user anything

## Sample output

What the system produces, generated against the example context files in `/context/`. Full version in [SAMPLE_BRIEFING.md](./SAMPLE_BRIEFING.md).

````markdown
# Weekly Financial Briefing -- Sunday, April 26, 2026

**Top action this week:** Deploy $30K into VXUS to close the international gap.
Two rules push in this direction (Rule #4 monthly DCA floor unmet, Rule #3
T-bill maturity in 12 days). International is also the only asset class within
striking distance of the Rule #5 drift threshold.

## Portfolio Snapshot
- Total: ~$1,148K, down 0.4% from last week.
- Top movers: ACME +$3,200 on earnings, VOO +$1,800, FNRG -$1,500.

## Allocation Check
| Asset Class         | Current | Target  | Status                                    |
|---------------------|---------|---------|-------------------------------------------|
| US Equities (index) | 59%     | 50-55%  | Over by 4-9%. Within wider tolerance.     |
| International       | 13%     | 15-20%  | Under by 2-7%. Closest to Rule #5 trigger.|
| Bonds (index)       | 4%      | 5-10%   | Under by 1-6%. Not urgent.                |
| High-conviction     | 10%     | 5-10%   | At target.                                |
| Cash + T-bills      | 9%      | 5-15%   | At target.                                |

Rule #5 status: International is at 7% drift from the 17.5% midpoint. One more
month of US outperformance and this trips the 5-percentage-point threshold.

## Rule Status
- Rule #1 (10% drawdown):     NOT TRIGGERED. S&P down 5.35% from ATH.
- Rule #3 (T-bill maturity):  TRIGGERED. ~$10K maturing 5/8. Default: deploy.
- Rule #4 (Monthly DCA floor): NOT MET. No April deployment logged yet.
- Rule #10 (3%+ down day):    NOT TRIGGERED. None in last 14 sessions.

## Recommended Actions
1. Deploy $30K into VXUS. Funded by the $10K T-bill maturity on 5/8 and
   $20K from the money market. Satisfies Rule #3, Rule #4, and closes the
   international gap before Rule #5 fires.
2. Email the CPA about AMT credit recovery (~$20K unclaimed, statute approaching).
3. Hold options through expiration unless ORBT moves materially.

Nothing else needs action this week.
````

## Key design decisions

**Markdown as the source of truth, not a database.** Context files are human-readable, diff-able, AI-readable. No schema migrations. The user owns their data because it lives in a folder, not a SaaS account. Every other architectural choice flows from this one.

**Mechanical rules over discretion.** The behavioral failure mode this is built to fight is freezing during drawdowns. The system's job is to remove the decision surface: "Rule #1 says deploy $65K. Want to execute?" -- not to re-debate whether the rule is right. The rules live in `GOALS_AND_RULES.md`, are referenced by number, and the briefing reports each one's trigger status individually.

**Specificity over hedging.** The system prompt bans "consider" and "you might want to." If a rule triggers, the AI states the rule number and the action with a dollar amount. If nothing triggers, it says so briefly. The prompt also bans em-dashes and softening words.

**Personal first.** This is built because I needed it, not because it has a market. Whether it generalizes is a question for after it has been useful for six months.

## Tech stack

- TypeScript / Node, run via `tsx`
- Anthropic SDK (`@anthropic-ai/sdk`), Claude Sonnet with prompt caching on both the system prompt and the context block
- Monarch Money MCP (community Python server by `robcerda`, registered in `~/.claude.json`)
- Yahoo Finance public chart endpoint for S&P 500
- Resend for email
- No hosting. Runs locally on a cron or manually.

## How to run it

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in:
#   ANTHROPIC_API_KEY
#   RESEND_API_KEY   (optional -- script logs to stdout if missing)
#   EMAIL_TO         (optional)
#   EMAIL_FROM       (optional)

# 3. Populate the context files
# Copy the .example.md files in /context/ and remove the .example suffix.
# Replace the placeholder content with your own portfolio data, goals, and rules.

# 4. Set up the Monarch Money MCP server
# Follow the setup notes in /knowledge/mcp-integrations/knowledge.md.
# Required if you want positions and balances populated automatically; not
# strictly required to run the briefing (you can maintain everything by hand
# in the markdown files).

# 5. Run the briefing
npm run briefing
```

The script prints the briefing to stdout and emails it if the Resend env vars are set.

## What I learned

> These are observations the assistant proposed from the project state. Specific to this build, not generic AI takes. Some are framed as questions where the assistant wasn't sure what I'd actually conclude.

1. **Monarch's `get_accounts.balance` is unreliable for any account that isn't a depository, credit, or feed-backed brokerage.** Crypto accounts return `null`. Manual "Other" accounts return `0` even when the UI shows a real value. The first net worth I computed from the feed was off by a large margin until I added reconciliation logic to fall back to `get_account_holdings` for crypto and to the markdown for manual accounts. The fix is documented as Rules R1-R3 in `/knowledge/mcp-integrations/rules.md`. Lesson: aggregators model the world they expect to see, and the long tail of how people actually hold money breaks that model in ways that look like the API working correctly.

2. **Prompt caching mattered more than expected for this workload.** The context block is large (~four markdown files, several thousand tokens) and stable across runs. Without caching, every weekly briefing repays the cost of reading the same context. With `cache_control: { type: "ephemeral" }` on both the system prompt and the context block, the second invocation in a 5-minute window is dramatically cheaper and noticeably faster. *[Open question for me to verify with real numbers from my own runs: actual % cost reduction and latency delta. Filling in.]*

3. **Email beat chat as the primary surface, but I'm not sure why yet.** I started assuming this would be a chat interface. The weekly email turned out to be the format I actually engage with. Hypotheses I have not validated: (a) the email arrives without me asking, which removes the activation energy of opening a chat; (b) the structured format of the briefing is easier to skim than a conversation; (c) chat invites back-and-forth that I don't always want.

4. **The mechanical-rules approach was the right constraint on AI advice, but it created a new problem: when nothing triggers, what does the system say?** The first version of the briefing tried to be helpful even when no rule fired, and the output drifted into generic commentary that I started ignoring. The current system prompt explicitly says "if nothing is triggered and no action is needed, say that briefly. Don't manufacture urgency." That single instruction made the briefings useful again. The takeaway, tentatively: rules are not just inputs to the AI; they are also a tool for telling the AI when to shut up.

5. **Context freshness is the silent failure mode.** *[This one is mine to fill in -- I have the bones of an observation about how `DECISIONS.md` going stale degrades the system, but I want to write it honestly after I see it happen a few more times. Placeholder.]*

## Why I built this

Built for myself because I had money scattered across six platforms and no unified view or advisory layer. Sharing publicly as a portfolio artifact. Not actively maintained as a product. If the architecture is useful to you, fork it. If you want to talk about the design choices, the issues tab is open.
