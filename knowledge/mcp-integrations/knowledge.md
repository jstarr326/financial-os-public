# MCP Integrations -- Knowledge (facts and patterns)

## Monarch Money MCP

### Setup path that worked

Repo: `robcerda/monarch-mcp-server` on GitHub. Python, uv-managed.

1. `brew install uv` (or curl installer -- either works)
2. `git clone https://github.com/robcerda/monarch-mcp-server.git ~/dev/monarch-mcp-server`
3. `cd ~/dev/monarch-mcp-server && uv sync`
4. `uv run python login_setup.py` -- **must run in a real terminal**, not inside a Claude Code shell, because it needs interactive password + MFA prompts
5. Register in `~/.claude.json` under `mcpServers` with command `/opt/homebrew/bin/uv` and args `["run", "--with", "mcp[cli]", "--with-editable", "<repo>", "mcp", "run", "<repo>/src/monarch_mcp_server/server.py"]`
6. Restart Claude Code (session-scope MCP load, no hot-reload)

Sessions stored in macOS Keychain (safer than the pickle files that some community MCPs use).

### SSO / Google-login gotcha

If the user logs into Monarch via Google SSO, `login_setup.py` can't use email/password -- falls back to prompting for a session token. The token must come from the `Authorization: Token <value>` request header on a live API call (Network tab > Fetch/XHR > any `api.monarch.com/graphql` request). The value in Local Storage under `persist:auth` or `token` is a different string and will 401 against the API. The API host is `api.monarch.com`, not `api.monarchmoney.com`.

### Account shape observed on first sync

Multiple account types returned by `get_accounts`. Types seen: `brokerage`, `depository`, `credit`, `other_asset`. Institutions include explicit strings (`"Charles Schwab"`, `"Bank of America"`, `"Wealthfront"`, `"Coinbase"`) and `null` for some manual/direct accounts.

### Where `get_accounts` balance lies

| Account type | `balance` field | Reality |
|---|---|---|
| `depository` (checking/savings) | Correct | OK |
| `credit` | Correct (negative) | OK |
| `brokerage` -- equities (IRA/taxable) | Correct | OK |
| `brokerage` -- crypto | `null` | Holdings in `get_account_holdings` |
| `brokerage` -- manual ("Other") | `0` | Only visible in Monarch UI / context file |
| `other_asset` | Correct | OK |

### `get_account_holdings` shape

Returns `portfolio.aggregateHoldings.edges[].node` with:
- `quantity` -- units held
- `totalValue` -- USD value (use this; already computed)
- `security.currentPrice`, `security.ticker`, `security.name`
- `basis` -- often 0 for crypto (Coinbase doesn't report cost basis through the feed)

For crypto accounts, `basis: 0.0` across the board means MCP data is useless for tax-loss harvesting or cost-basis analysis. Schwab brokerage may expose real basis -- not yet verified.
