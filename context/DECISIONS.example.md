# Decisions Log (EXAMPLE)

> This is an anonymized example file. All entries below are fictional and illustrative.
> This file is a running log of investment decisions and the reasoning behind them.
> Each entry captures: what was decided, why, what the system recommended, and what actually happened.
> Over time, this becomes the most valuable file in the system. It's how the AI learns the user's patterns and how the user learns from their own behavior.

## How to Use This File

After any financial decision (buy, sell, hold, rebalance, conversion, rule change), add an entry using the template below. Be honest about the reasoning, including emotional factors. The AI will reference this log when similar decisions come up in the future.

**Ask the AI to help log:** After making a decision, say "Log this decision" and describe what you did. The AI drafts the entry and you confirm.

## Entry Template

```
### YYYY-MM-DD: [Brief description]
- **Action:** What you did (bought, sold, held, converted, rebalanced)
- **Amount:** Dollar amount and instruments involved
- **Trigger:** What prompted this (rule trigger, market event, life change, AI recommendation)
- **Reasoning:** Why you made this choice (include emotional state if relevant)
- **What the system said:** What did the AI recommend? Did you follow it?
- **Alternatives considered:** What else did you think about doing?
- **Outcome:** [Fill in later] What happened? Was this the right call in hindsight?
- **Lesson:** [Fill in later] What would you do differently?
```

## Decisions

### 2026-03-14: Deployed $40K from maturing T-bills into VOO and VXUS
- **Action:** Bought $25K of VOO and $15K of VXUS in Brokerage A
- **Amount:** $40,000 total, split 62/38 toward US large cap and international
- **Trigger:** T-bill maturity (Rule #3: default deploy at maturity, not roll)
- **Reasoning:** T-bills matured. International was the bigger gap so I weighted toward VXUS. Market was flat that week, no drawdown trigger, but rules say each maturity is a forcing function and I was already overweight cash.
- **What the system said:** Recommended a 50/50 split between VOO and VXUS to close the international gap faster. I went 62/38 because I didn't want to add more VXUS in a single tranche given the small position size.
- **Alternatives considered:** Roll into new T-bills (rejected: rates declining, already overweight cash). All VOO (rejected: would make international gap worse).
- **Outcome:** [TBD -- revisit in Q3]
- **Lesson:** [TBD]

### 2026-03-22: Did NOT deploy cash despite 3.4% down day in S&P
- **Action:** Held. No purchase.
- **Amount:** $0
- **Trigger:** Rule #10 triggered (3%+ down day) -- but I didn't act
- **Reasoning:** I was traveling and didn't see the market move until end of day. By the time I checked, the futures were already up overnight and I told myself "I'll wait to see if it follows through tomorrow."
- **What the system said:** Briefing the next morning flagged Rule #10 as triggered and recommended deploying $20-30K from the money market into VTI/VXUS. I read it, agreed in principle, and still didn't act.
- **Alternatives considered:** Deploy $20K as planned. Half-deploy ($10K) as a hedge. Wait for another red day.
- **Outcome:** Market rallied 4% over the next two weeks. The $20K I didn't deploy is now worth ~$20.8K instead of ~$21.2K (estimated). Small dollar miss, but it's the exact pattern Rule #10 was built to prevent.
- **Lesson:** The behavioral pattern is real. Rule #10 needs an enforcement mechanism beyond "the system tells me" -- maybe a same-day mobile alert, not a next-morning email. Filing this as input for a future system change.

### 2026-04-02: Sold covered call on ACME at $180 strike
- **Action:** Sold 2x ACME $180 Call expiring 06/19/26
- **Amount:** Premium collected: $450
- **Trigger:** ACME ran up to $155 after earnings. I was getting uncomfortable with concentration. Wanted to set a disciplined exit at $180 (a price I'd be happy to trim at) while collecting income.
- **Reasoning:** This is the options philosophy from GOALS_AND_RULES.md: write covered calls at a strike where I'd be a happy seller. Not speculating, not trying to time. Just using options to manage the position.
- **What the system said:** Flagged ACME as the largest single-name position and noted it had drifted above my 5-10% high-conviction band on dollar value. Recommended either trimming outright or writing calls. I chose calls.
- **Alternatives considered:** Trim 25% outright (rejected: would realize a $5K short-term gain unnecessarily). Write further-out calls at $200 (rejected: less premium, want a tighter exit if it runs).
- **Outcome:** [TBD]
- **Lesson:** [TBD]
