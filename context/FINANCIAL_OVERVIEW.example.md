# Financial Overview (EXAMPLE)

> This is an anonymized example file. All numbers, accounts, and positions are fictional.
> Last updated: 2026-04-16 (example date)
> Filing status: Single (example)
> Next review: Verify private investment totals not in feed

## Net Worth Summary

| Category | Value | % of Total | Source |
|---|---|---|---|
| Public equities (Brokerage A + Brokerage B, ex-cash) | $740,000 | 74% | Feed |
| Cash + T-bills (Money market $30K + TreasuryDirect $50K + Checking $10K + Brokerage B cash $5K) | $95,000 | 9.5% | Feed |
| Crypto | $40,000 | 4% | Feed (holdings-level) |
| Retirement accounts (Roth IRA + Rollover IRA) | $250,000 | 25% | Feed |
| Private investments | $25,000 | 2.5% | Manual |
| Credit cards | -$2,000 | 0% | Feed |
| **Total** | **~$1,148,000** | **100%** | |

> Numbers above are illustrative and sum to a fictional ~$1.15M portfolio.

## Tax Assets (Not Reflected in Net Worth)

These are off-balance-sheet tax benefits that reduce future tax liability:

| Tax Asset | Estimated Value | Status |
|---|---|---|
| AMT credit carryforward (Form 8801) | ~$20,000 | UNCLAIMED -- amended returns needed |
| Direct-indexing TLH capital loss carryforward | ~$25,000 | Active -- already realized, available immediately |
| ALT (crypto) unrealized capital loss | ~$19,000 | Available on sale |
| Capital loss carryforward (prior year) | ~$3,000 | Verify on Schedule D |
| **Total potential tax savings (at ~28% combined rate)** | **~$18,000-$22,000** | |

## Accounts

### Brokerage A (Taxable) -- $530,000 total

**Account: Brokerage A (...XXXX)**

| Ticker | Name | Qty | Basis | Value | Gain/Loss |
|--------|------|-----|-------|-------|-----------|
| VOO | Vanguard S&P 500 | 500 | $200,000 | $250,000 | +$50,000 |
| VXUS | Vanguard Total Intl | 1,333 | $72,000 | $80,000 | +$8,000 |
| BND | Vanguard Total Bond | 417 | $30,500 | $30,000 | -$500 |
| ACME | Acme Industrial (fictional) | 400 | $40,000 | $60,000 | +$20,000 |
| ORBT | Orbital Systems (fictional) | 750 | $20,000 | $30,000 | +$10,000 |
| FNRG | Future Energy Co (fictional) | 1,000 | $32,000 | $20,000 | -$12,000 |
| MMKT | Money Market Sweep | 30,000 | $30,000 | $30,000 | -- (cash) |

**Options positions:**

| Contract | Type | Qty | Value | Notes |
|----------|------|-----|-------|-------|
| ACME $180 Call 06/19/26 | Short call | -2 | -$450 | Covered call on ACME |
| ORBT $35 Put 05/15/26 | Short put | -3 | -$300 | Selling downside on ORBT |
| FNRG $10 Put 06/19/26 | Short put | -5 | -$150 | Selling downside on FNRG |

### Roth IRA (...XXXX) -- $120,000

| Ticker | Name | Qty | Basis | Value | Gain/Loss |
|--------|------|-----|-------|-------|-----------|
| VOO | Vanguard S&P 500 | 160 | $60,000 | $80,000 | +$20,000 |
| VXUS | Vanguard Total Intl | 500 | $27,000 | $30,000 | +$3,000 |
| BND | Vanguard Total Bond | 139 | $10,200 | $10,000 | -$200 |

### Rollover IRA (...XXXX) -- $130,000

| Ticker | Name | Qty | Basis | Value | Gain/Loss |
|--------|------|-----|-------|-------|-----------|
| VOO | Vanguard S&P 500 | 180 | $68,000 | $90,000 | +$22,000 |
| VXUS | Vanguard Total Intl | 500 | $28,000 | $30,000 | +$2,000 |
| BND | Vanguard Total Bond | 139 | $10,200 | $10,000 | -$200 |

### Brokerage B / Direct Indexing (...XXXX) -- $150,000

| Ticker | Name | Qty | Basis | Value | Gain/Loss |
|--------|------|-----|-------|-------|-----------|
| US.DIRECT.INDEXING | Direct Index (US large cap) | 1,000 | $105,000 | $130,000 | +$25,000 |
| VXUS | Vanguard Total Intl | 250 | $13,500 | $15,000 | +$1,500 |
| USD | Cash | 5,000 | -- | $5,000 | -- |

- **Strategy:** Direct indexing (US large cap), automated tax-loss harvesting
- **Notes:** Direct-indexing TLH creates wash sale risk with Brokerage A positions. Must cross-reference before any Brokerage A sells. The "US Direct Indexing" line is a basket of individual stocks that the feed rolls up -- individual stock names not visible here.
- **TODO:** Get individual stock list inside direct indexing basket (for wash sale cross-reference with Brokerage A).

### Crypto Exchange (~$40,000 -- holdings-level)
- **Data source:** Feed (holdings-level). Account-level balance returns null, but holdings data is live and priced.
- **Holdings:**
  - ETH: 6.0 @ $2,500 = $15,000
  - BTC: 0.33 @ $75,000 = $24,750
  - ALT: 25,000 @ $0.04 = $1,000 (cost basis ~$20,000, unrealized loss ~$19,000)
- **Notes:** ALT loss is a strategic tax asset. ETH and BTC are the real value here, not ALT. Feed doesn't provide cost basis for crypto (all show $0). Cost basis still needs to be sourced from the exchange directly or tax records.
- **TODO:** Get cost basis for ETH and BTC positions.

### TreasuryDirect ($50,000)
- **Data source:** Manual
- **Holding:** 4-Week T-bill (rolling)
- **Current rate:** ~3.7%
- **Notes:** Cash parking lot, not strategic allocation. Each maturity is a deployment decision.

### Checking Account ($10,000)
- **Data source:** Feed
- **Notes:** Operating account for monthly burn. Not a meaningful part of the portfolio.

### Private Investments ($25,000 deployed)
- **Data source:** Manual
- **Positions:**
  - Venture Fund I: $50,000 committed, $25,000 wired
- **Uncalled commitments:** $25,000
- **Notes:** Illiquid. Don't factor into rebalancing. Capital call could come at any time.

### Credit Cards (-$2,000 total)
- Trivial balances, paid in full monthly. Not a factor in net worth planning.

## Asset Allocation (Current vs. Target)

Calculated from position-level feed data. Total portfolio: ~$1,148K.

| Asset Class | Value | Current % | Target % | Delta | Notes |
|---|---|---|---|---|---|
| US Equities (index core) | $680K | 59% | 50-55% | Over by 4-9% | VOO across all accounts + direct indexing basket |
| International Equities (index) | $155K | 13% | 15-20% | Under by 2-7% | VXUS across all accounts |
| Bonds (index) | $50K | 4% | 5-10% | Under by 1-6% | BND across IRAs and brokerage |
| High-conviction picks | $110K | 10% | 5-10% | At target | ACME, ORBT, FNRG |
| Cash + T-bills | $95K | 9% | 5-15% | At target | Money market + TreasuryDirect + checking |
| Crypto | $40K | 3% | 3-5% | At target | BTC, ETH, ALT (tax asset) |
| Private/Alternatives | $25K | 2% | 5-10% | Under | Illiquid |

> **Methodology:** Money market counted as cash, not equities. Direct indexing counted as US large cap. Options positions excluded from allocation (small, short-term).

### Biggest gaps to close
1. **US large cap slightly overweight** -- 59% vs. 50-55% target. Drift driven by VOO appreciation. Within tolerance for now, monitor.
2. **International under target** -- deploy cash into VXUS to close the gap.
3. **Bonds under target** -- minor, can fill from cash or T-bill maturities.

## Options Income Tracking

**Monthly options premium:**

| Date | Trade | Premium | Status |
|---|---|---|---|
| 03/19 | Sell PUT ORBT $35 exp 04/17 | +$150 | Expired worthless |
| 03/25 | Sell PUT FNRG $10 exp 04/17 | +$100 | Expired worthless |
| 04/02 | Sell CALL ACME $180 exp 06/19 | +$450 | Open |
| 04/13 | Sell PUT ORBT $35 exp 05/15 | +$200 | Open |
| 04/14 | Sell PUT FNRG $10 exp 06/19 | +$150 | Open |

**Net premium collected this month: ~$1,050**

## Data Source Status

| Source | Connection | Status | Refresh Frequency |
|---|---|---|---|
| Brokerage A | Via aggregator MCP | LIVE (positions + aggregate cost basis) | On-demand |
| Brokerage A | Direct broker MCP | NOT CONNECTED | Goal: lot-level cost basis |
| Aggregator (Monarch) | MCP | CONNECTED | On-demand |
| Brokerage B / Direct Indexing | Via aggregator MCP | LIVE (positions + aggregate cost basis) | On-demand |
| Crypto Exchange | Via aggregator MCP | LIVE (holdings-level, account balance null) | On-demand |
| TreasuryDirect | Manual | $50K manual entry | At maturity events |
| Checking | Via aggregator MCP | LIVE | On-demand |
| Private investments | Manual | $25K manual | Quarterly |
| Credit cards | Via aggregator MCP | LIVE | On-demand |
