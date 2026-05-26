# MCP Integrations -- Hypotheses (need more data)

## Monarch Money MCP

### H1. Schwab brokerage `balance` is reliable because Schwab pushes a net-liquidation-value field Monarch uses directly; Coinbase doesn't.

**Evidence for:** All Schwab brokerage accounts returned accurate balances on the first query. Coinbase returned `null`.

**Evidence against:** None yet.

**How to test:** Next time the Monarch UI shows a Schwab balance change mid-day (e.g., big market move), query `get_accounts` and compare. If balance tracks intraday, this hypothesis holds. If it's end-of-day stale, the hypothesis partially breaks.

**Promote to rule if:** Confirmed 3+ times across Schwab accounts under different market conditions.

### H2. `refresh_accounts` forces a re-fetch that populates the `null`/`0` balances for crypto and manual accounts.

**Evidence for:** Named `refresh_accounts` in the MCP tool list -- suggests it triggers the same action as the UI's "Refresh all" button.

**Evidence against:** Untested. The Coinbase null and manual-account $0 results may be from a stale cache, OR from the field simply not existing for those account types. `refresh_accounts` might not fix a structural null.

**How to test:** Call `refresh_accounts`, wait ~30s, call `get_accounts` again. If previously-null balances now populate, hypothesis confirmed. If still null/$0, the field is just not populated for those types regardless of freshness.

**Promote to rule if:** Refresh consistently fixes the null/$0 case.

### H3. Manual "Other" accounts expose their value through a field other than `balance` (possibly `displayBalance` or `currentBalance`) that the MCP isn't surfacing.

**Evidence for:** The Monarch UI clearly shows manual-account values. That number is stored somewhere in the GraphQL response; the MCP just isn't returning it in the `get_accounts` tool.

**Evidence against:** Possible the MCP is returning it faithfully and Monarch simply doesn't populate `balance` for manually-entered accounts -- the value may live on the account's "manual value history" rather than on the account record itself.

**How to test:** Read `monarch-mcp-server/src/monarch_mcp_server/server.py` and see what fields the `get_accounts` GraphQL query selects. Compare to what a browser call to the same Monarch endpoint returns.

**Promote to rule if:** Field identified and patchable. If patched, R3 becomes obsolete and we can trust the MCP for manual accounts.

### H4. The `basis: 0.0` in Coinbase holdings is a Coinbase-side limitation, not an MCP bug.

**Evidence for:** Coinbase API famously does not expose historical cost basis via the consumer-facing feeds used by aggregators. Consistent zero across all crypto positions matches this pattern.

**Evidence against:** None yet, but unverified.

**How to test:** Check a Schwab brokerage's holdings call -- if `basis` is populated for a known lot, then the MCP can carry basis and the Coinbase zero is upstream. If Schwab is also zero, the MCP itself drops the field.

**Promote to rule if:** Confirmed that basis works for Schwab but not Coinbase. Has real consequences for tax-loss harvesting analysis.
