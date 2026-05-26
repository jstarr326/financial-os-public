# MCP Integrations -- Rules (apply by default)

## Monarch Money MCP

### R1. Never trust `get_accounts` `balance` field for totals. Always reconcile against the Monarch web UI.

**Source incident:** On first query after setup, `get_accounts` returned `null` for the user's crypto brokerage account and `0` for several manually-entered "Other" accounts containing real value. Other account types (depository, credit, brokerage with equities) returned correct balances. The result was an under-reported net worth by a non-trivial margin -- entirely on accounts containing live-priced assets or manually-entered values.

**How to apply:** Before reporting any MCP-derived total to the user, either (a) spot-check the figure against the Monarch UI, or (b) state explicitly that the number is pre-reconciliation and may be off for crypto/manual accounts.

### R2. For crypto / live-priced holdings accounts, compute balance from `get_account_holdings`.

Sum the `totalValue` field across all `aggregateHoldings.edges[].node`. Verified for a crypto brokerage account -- the sum matched the Monarch UI to within a few dollars (price-tick timing).

**How to apply:** Whenever the account type is `brokerage` with crypto or equities and `get_accounts` returns `null` or suspicious-looking `balance`, call `get_account_holdings` and sum `totalValue`.

### R3. For manual "Other" accounts, fall back to `/context/FINANCIAL_OVERVIEW.md`.

Manually-entered accounts (private investments, illiquid holdings, anything the user maintains by hand) are maintained outside any feed. The MCP cannot see the manual value reliably -- `balance` may be `0` even when the UI shows a real number. Values in `FINANCIAL_OVERVIEW.md` are the source of truth for these.

**How to apply:** Private investments, disconnected accounts, and anything the user edits manually should be read from the context file, not the MCP.

### R4. After setup or long idle, the first MCP call has a 10-20s cold-start penalty.

`uv run --with mcp[cli] --with-editable ...` resolves the venv on first invocation. Warn the user before running a query in a fresh session; don't interpret the pause as a hang.
