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

### 2026-02-10: Deployed $10K T-bill maturity into VXUS
- **Action:** Bought $10K of VXUS in Brokerage A
- **Amount:** $10,000
- **Trigger:** Rule #3 (T-bill maturity, default deploy not roll)
- **Reasoning:** 4-week T-bill matured 2/8. Rule #3 says default action is deploy, not reinvest in T-bills. International was the largest gap so I sent the full amount to VXUS rather than splitting. No drawdown trigger this week, but the maturity itself is the forcing function.
- **What the system said:** Briefing on 2/9 flagged the upcoming maturity, recommended VXUS, and stated the rule by number. I executed within 24 hours of reading the briefing.
- **Alternatives considered:** Roll into new T-bills (rejected: violates Rule #3 default). Split 50/50 with VOO (rejected: VOO is overweight already).
- **Outcome:** Position is up ~6% as of the April briefing. Closing the international gap is a slow process but each maturity moves it.
- **Lesson:** When the system runs the rule and quantifies the trade, action latency drops to under a day. The friction was never the decision, it was the decision surface. This is what Rule #3 was built to remove.

### 2025-11-18: Rebalanced US equities down after Rule #5 drift trigger
- **Action:** Sold $15K VOO in Brokerage A. Bought $10K VXUS and $5K BND.
- **Amount:** $15,000 reallocated
- **Trigger:** Rule #5 (5% drift threshold). US equities had drifted to 60% vs. 52.5% midpoint, 7.5 points over.
- **Reasoning:** US large cap had run hard for 6 months. The drift threshold tripped. I'd been avoiding the rebalance because realizing gains in a taxable account feels wasteful, but the rule is the rule and the system kept flagging it for three weeks running.
- **What the system said:** Three consecutive weekly briefings flagged Rule #5 as triggered. Recommended trimming VOO and redeploying into VXUS and BND. CPA agent flagged that direct-indexing TLH carryforward could absorb the ~$3K realized gain at zero net tax.
- **Alternatives considered:** Wait for international to catch up naturally (rejected: that's the avoidance pattern Rule #5 exists to override). Trim ACME instead (rejected: high-conviction positions are sized on entry, not current value; VOO is the index core).
- **Outcome:** Realized $3,100 long-term gain on VOO. Paired with $3,100 of the direct-indexing TLH carryforward. Net federal tax: $0. International position is closer to target.
- **Lesson:** Rule #5 plus the CPA agent's carryforward inventory is the two-agents-one-memory pattern working as designed. The wealth manager said "rebalance"; the CPA agent said "here's the loss to pair it with"; the net realized tax was zero. Without the shared context, I'd have either deferred the rebalance or paid the tax.

### 2025-08-05: 3% down day on S&P -- bought VTI and added to ORBT
- **Action:** Bought $20K VTI and added 100 sh ORBT
- **Amount:** $20,000 VTI + $2,800 ORBT = $22,800 total deployment
- **Trigger:** Rule #10 (3%+ down day). S&P 500 was down 3.2% intraday on a tariff headline.
- **Reasoning:** The rule is the rule. I'd already pre-committed to deploying on big down days. I read the briefing the next morning, it flagged Rule #10, I executed before lunch. ORBT add was the high-conviction portion of the Rule #10 split (80-90% index, 10-20% satellite).
- **What the system said:** Briefing flagged Rule #10 triggered. Recommended $20K-$30K split with bulk into index. Named ORBT as the watchlist satellite to add to. Quantified the bracket math.
- **Alternatives considered:** Wait for follow-through to the downside (rejected: that's market timing, which Rule #10 explicitly bans). Full $30K instead of $22.8K (rejected: wanted to keep some powder for a potential second leg down).
- **Outcome:** S&P recovered the 3% within two weeks. VTI position is up ~14% from entry as of April 2026. ORBT add is up ~28%.
- **Lesson:** When I act on Rule #10 the same day, it works. When I don't (see 2026-03-22), I miss. The system's job is to remove the activation energy on red days, and on this one it did.

### 2025-12-15: Did NOT deploy on 3.1% down day
- **Action:** Held. No purchase.
- **Amount:** $0
- **Trigger:** Rule #10 triggered (3%+ down day) -- skipped
- **Reasoning:** The down day was driven by a Fed surprise and the next-day futures were red overnight. I told myself "the rule says deploy on the day, not the day after, and I missed the window." That's a rationalization. The rule says deploy on big down days. The window doesn't close at midnight.
- **What the system said:** Briefing on 12/16 flagged Rule #10 as triggered and recommended a $20K deployment split 85/15 across VTI and ORBT. I read it, agreed in principle, and let it sit until the market recovered.
- **Alternatives considered:** Half-deploy ($10K) as a compromise. Deploy into VXUS instead of VTI (would have been worse, international lagged the recovery).
- **Outcome:** S&P recovered the 3% in 8 trading days. The $20K I didn't deploy would now be worth ~$22.1K. Estimated cost of inaction: ~$2,100.
- **Lesson:** This is the second Rule #10 miss in 12 months (see also 2026-03-22). Two data points, same pattern: I rationalize past the rule when the down day happens during a busy work period or overnight. The system change to investigate: a same-day push alert on 3%+ down days, separate from the weekly briefing. Filing this for the system review.

### 2025-09-02: Roth conversion of $42K from Rollover IRA
- **Action:** Converted $42,000 from Rollover IRA to Roth IRA
- **Amount:** $42,000
- **Trigger:** CPA agent flagged the bracket headroom in the August tax audit. Income year was tracking low. Window closes December 31.
- **Reasoning:** Filled the 10% and 12% federal brackets entirely. Stopped before crossing into 22%. Coordinated to avoid pushing LTCG out of the 0% bracket -- so I deferred the planned ACME trim to January 2026.
- **What the system said:** CPA agent ran the bracket math, recommended $42K-$45K, and called out the LTCG bracket interaction. Wealth manager noted that the planned ACME trim would have to wait until 2026 if I did the full conversion.
- **Alternatives considered:** Smaller $25K conversion (rejected: leaves bracket room on the table in a year that won't repeat). Full $50K into the 22% bracket (rejected: the marginal jump from 12% to 22% isn't worth the bracket-crossing).
- **Outcome:** Federal tax owed for 2025: ~$4,800 on the conversion. Form 8606 filed with the 2025 return. Roth balance up ~7% on the converted amount through April 2026, all tax-free going forward.
- **Lesson:** The two-agents-one-memory pattern again. CPA flagged the opportunity, wealth manager confirmed it didn't conflict with allocation moves I was about to make, I executed in a single afternoon. Without the shared context, the wealth manager would have recommended the ACME trim and pushed me out of the 0% LTCG bracket on a year I could have realized those gains tax-free.

### 2025-07-08: Declined to add to ACME at $148
- **Action:** Held. No purchase.
- **Amount:** $0
- **Trigger:** ACME had a strong earnings print and was up 8% on the week. I wanted to add more.
- **Reasoning:** Rule #7 says no chasing rallies. The system flagged that ACME was already at the top of the 5-10% high-conviction band. Sizing on entry, not chasing momentum. The thesis works whether I add or not, and adding now would be FOMO.
- **What the system said:** Flagged the existing ACME position size, restated the philosophy (size on entry, not on current value), and recommended holding. Did not recommend adding.
- **Alternatives considered:** Add 100 sh at $148 (rejected: violates Rule #7 and the size-on-entry rule). Sell a cash-secured put at $130 to add at a discount if it pulls back (considered, deferred -- ended up writing the $180 call instead in April).
- **Outcome:** ACME pulled back to $138 within three weeks. Adding at $148 would have been a $1,000 paper loss on 100 sh before recovering. The restraint was right.
- **Lesson:** Most decision logs are about what I did. This one is about what I didn't do. The system is as useful for preventing bad action as it is for prompting good action. Worth logging the non-trades.

### 2025-06-20: Sold cash-secured put on FNRG at $9 strike
- **Action:** Sold 5x FNRG $9 Put expiring 07/18/25
- **Amount:** Premium collected: $175. Cash collateral: $4,500.
- **Trigger:** FNRG had pulled back to $11.50. I wanted to add at $9 -- a price I'd be happy to buy at -- and the put let me get paid to wait.
- **Reasoning:** Disciplined entry tool per the options philosophy. If FNRG drops to $9, I add 500 sh at an effective basis of $8.65 after the premium. If it doesn't, I keep $175 and the $4,500 is freed back up in 28 days.
- **What the system said:** Confirmed the trade fit the philosophy (high-conviction name, strike at a price I'd buy at anyway, sized so assignment is acceptable). Flagged that cash for the put collateral came out of the money market and would not be available for Rule #10 deployment during the open period.
- **Alternatives considered:** Buy 500 sh outright at $11.50 (rejected: not the entry price I want). Sell at $10 strike for more premium (rejected: $9 is the price I'd actually be a buyer at, not $10).
- **Outcome:** Put expired worthless on 07/18/25. Kept the $175. FNRG never touched $9 during the period. I wrote a new put at $10 the following month (premium $150) and the pattern has continued -- the position labeled FNRG $10 Put 06/19 in FINANCIAL_OVERVIEW.md is the current iteration.
- **Lesson:** Selling puts on names I want to own at strikes I'd actually buy at is the cleanest application of the options philosophy. It pays me to wait. The only risk to manage is the collateral allocation -- making sure I'm not committing so much cash to puts that I can't act on Rule #10 if a real down day hits.

### 2026-01-12: Realized $8K ACME gain paired with FNRG harvest
- **Action:** Sold 50 sh ACME at $160 in Brokerage A. Sold 400 sh FNRG at $20 in Brokerage A.
- **Amount:** $8,000 realized long-term gain on ACME. $4,800 realized short-term loss on FNRG.
- **Trigger:** Annual rebalancing (Rule #6) plus CPA agent recommendation from the December tax audit.
- **Reasoning:** ACME had drifted to ~$65K (just over the high-conviction band on dollar value). Trimming 50 sh brought it back to the band. CPA agent flagged that the $25K direct-indexing TLH carryforward was sitting idle and recommended pairing any realized gain with an existing loss inside the same calendar year. The FNRG harvest was layered in to use short-term character against short-term character (ACME 50 sh were a recent add, short-term).
- **What the system said:** Wealth manager recommended the ACME trim. CPA agent recommended pairing with FNRG (short-term to match the ACME lot character) and reserving the direct-indexing carryforward for a larger future event. Both agents reached the same trade from different starting points.
- **Alternatives considered:** Use the direct-indexing carryforward instead of FNRG (rejected per CPA recommendation: save the larger carryforward for a larger gain event). Skip the rebalance and let ACME run (rejected: Rule #6 says annual review).
- **Outcome:** Net realized capital gain after pairing: $3,200. Effective federal tax at LTCG rates: ~$480 (15% on the LT portion). FNRG re-entry happened on 02/18/26 at $18.50 after the 30-day wash sale window closed -- 400 sh re-bought $200 below the harvest price.
- **Lesson:** This is the two-agents-one-memory pattern in its cleanest form. Wealth manager triggered the gain event. CPA agent staged the loss to absorb it. Net tax was a fraction of what it would have been if the wealth manager had executed without tax coordination. The 30-day wash sale window also forced a real pause on FNRG re-entry, which turned into a slightly better entry price.
