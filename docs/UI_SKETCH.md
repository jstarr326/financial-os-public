# UI Sketch

Design doc for a single-page web view of the Financial OS. Not yet built. This document captures what the UI would do, what tradeoffs it makes against the existing email surface, and what is intentionally out of scope for a first version.

## Why a UI at all

The current surfaces are:
1. The weekly email briefing (the wealth manager's output)
2. The on-demand tax audit (the CPA's output, printed to stdout)
3. Conversations with a Claude Project that has the markdown context loaded

The email surface works for the weekly cadence, but it has known limitations:
- Rule trigger status is only knowable when the briefing runs. There is no way to peek at "is Rule #1 currently triggered" without invoking the script.
- The tax audit is a long block of text. Multiple deadline-bearing items (AMT statute, Roth window, T-bill maturities) compete for visual attention.
- Allocation drift is reported as a table. A ring chart would communicate the same information in roughly a tenth of a second.
- No record of what the user actually executed after a briefing -- decisions get logged in `DECISIONS.md` only if the user remembers to write them.

A UI would address those four things and only those four things. It is not a replacement for the email; it is a complement.

## What this UI is

A single-page web app that renders:
1. **The current top action** (most recent briefing's lead item) with execute / defer / dismiss buttons that write back to `DECISIONS.md`
2. **Live allocation rings** computed from the latest Monarch MCP snapshot, with target bands shown as the ring's outer ticks
3. **Rule status lights** -- one indicator per mechanical rule, color-coded by trigger state, hoverable for the underlying numbers
4. **A recent-decisions feed** -- last 30 days of `DECISIONS.md` entries, with timestamps and the rule that drove each one
5. **A tax dashboard** -- a compact view of the CPA agent's outstanding items: AMT statute countdown, idle carryforwards, Roth window status
6. **Run controls** -- "Run wealth-manager briefing" and "Run tax audit" buttons that invoke the scripts and stream the output back into the page

## What this UI is not

- Not a portfolio dashboard. Monarch already does that. The point of the UI is to surface what needs action, not to be a better Mint.
- Not a trading interface. No execution from the page. Execute buttons write to `DECISIONS.md` and emit an alert; the user still places trades in their actual brokerage.
- Not multi-user. Single-tenant, runs locally or on a private Vercel deploy with the user's credentials in env vars.
- Not chat. There's a deliberate choice here: chat invites debate, and the wealth manager is designed to remove debate when a rule has fired. A chat surface would undo that.

## Layout sketch

```
┌──────────────────────────────────────────────────────────────┐
│ Financial OS                          Last sync: 5 min ago   │
│ ────────────────────────────────────────────────────────────  │
│                                                              │
│ ┌─ TOP ACTION ──────────────────────────────────────────┐    │
│ │ Deploy $30K into VXUS                                  │    │
│ │ Rule #4 unmet · Rule #3 fires in 12 days              │    │
│ │ [Execute] [Defer 1 week] [Dismiss]                     │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─ ALLOCATION ────────────┐  ┌─ RULE STATUS ────────────┐   │
│ │                          │  │  Rule #1   ●  NOT TRIG   │   │
│ │   [Ring chart with       │  │  Rule #2   ●  NOT TRIG   │   │
│ │    target band overlays] │  │  Rule #3   ●  TRIGGERED  │   │
│ │                          │  │  Rule #4   ●  NOT MET    │   │
│ │   US 59% (target 50-55%) │  │  Rule #5   ●  APPROACH   │   │
│ │   Intl 13% (target 15-20)│  │  Rule #10  ●  NOT TRIG   │   │
│ │   Drift flag: Intl -7%   │  │                          │   │
│ └──────────────────────────┘  └──────────────────────────┘   │
│                                                              │
│ ┌─ RECENT DECISIONS (30 days) ──────────────────────────┐    │
│ │ 2026-04-02  Sold ACME $180 call · +$450 premium       │    │
│ │ 2026-03-22  Missed Rule #10 trigger · lesson logged   │    │
│ │ 2026-03-14  Deployed $40K T-bill → VOO/VXUS           │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─ TAX DASHBOARD ───────────────────────────────────────┐    │
│ │ AMT credit:  ~$20K  · file 1040-X by Oct 2026 (158d)  │    │
│ │ TLH carry:   ~$25K  · idle. Apply against next gain.  │    │
│ │ Roth window: open   · low-income year ends Dec 31     │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ [Run wealth-manager briefing]  [Run tax audit]               │
└──────────────────────────────────────────────────────────────┘
```

## Component breakdown

| Component | Source of truth | Refresh strategy |
|---|---|---|
| Top action card | Most recent briefing artifact (cached) | Re-renders when briefing runs |
| Allocation rings | Live Monarch MCP call | On page load + manual refresh |
| Rule status lights | Computed in-browser from positions + live S&P quote | Polls Yahoo every 60s during market hours |
| Recent decisions feed | `DECISIONS.md` parsed at server | Re-renders when user clicks Execute/Defer/Dismiss |
| Tax dashboard | `TAX_CONTEXT.md` parsed at server + statute calculation | On page load |
| Run controls | Server-side script invocation | Streams stdout via SSE |

## Data flow

The UI is read-mostly. The only writes are to `DECISIONS.md`, and they happen via three buttons:

- **Execute** -- appends an entry to `DECISIONS.md` recording that the user followed the recommendation. Optional: trigger an email confirmation.
- **Defer 1 week** -- appends a deferral entry and silences the top-action card for 7 days. Useful for "I see it, I just can't act today."
- **Dismiss** -- appends a dismissal entry with a required reason field. Forces a one-line explanation of why the user is choosing not to follow the recommendation. This becomes training data for the system over time.

Live data (positions, allocation, market) is pulled on demand from the same MCPs the scripts use. The UI is a presentation layer, not a duplicate state.

## Tradeoffs vs. the email surface

| Dimension | Email | UI |
|---|---|---|
| Push vs. pull | Push -- arrives weekly without me asking | Pull -- I have to open the page |
| Activation energy | Zero -- in my inbox already | Low -- one bookmark click |
| State visibility | Frozen at briefing time | Live |
| Action capture | Manual -- I have to remember to log in DECISIONS.md | Built-in -- Execute/Defer/Dismiss buttons write it |
| Distraction risk | Low | Higher -- a dashboard invites checking |

The honest read: a UI does not replace the email. The email is the proactive ping. The UI is the place to act on it. If the email never arrived, I would not visit the UI on my own initiative -- which is exactly the freezing-during-drawdowns failure mode this whole system is designed to address.

## Out of scope for v1

- Auth. Single-user, runs behind a Vercel preview URL with basic auth or on localhost. No multi-tenancy.
- Mobile. Desktop-first. Mobile is a v2 question.
- Charts beyond the allocation ring. No P&L lines, no historical drawdown views. Those are dashboard features and would dilute the action-first framing.
- Editing context files from the UI. The markdown files are the source of truth and they are edited in a text editor, not through a form. This is load-bearing for the "user owns their data" architecture.
- Real-time price ticks. The rule status lights poll every 60s during market hours; that is sufficient resolution for rules that trigger on percentage drawdowns from 52-week highs.
- Notifications beyond email. No push, no SMS, no Slack. v2 question.

## Tech stack notes

If built:
- Next.js (App Router) + TypeScript + Tailwind for the frontend
- Server Components for the data-loading paths (reads against `/context/*.md` and the Monarch MCP)
- Server Actions for the Execute / Defer / Dismiss writes
- SSE for streaming script output back to the page
- Recharts (or D3) for the allocation rings
- Deployed to Vercel; runs against the same `.env` the scripts use; no separate database needed

The choice of "no database" is deliberate. The markdown files in `/context/` are the database. Anything the UI knows is derived from them or from the MCP calls. Adding a database would mean two sources of truth, and that is exactly the failure mode the markdown-as-source-of-truth bet is meant to avoid.

## Open questions

- **Does executing from the UI fight the architecture?** The whole system is built on "the user owns their data, the user makes the decisions, the AI just removes the decision surface." If the UI starts feeling like a control panel, does that move the system toward something more like a robo-advisor surface, which is exactly what this project is positioned against?
- **What happens to the email if the UI ships?** The honest answer is: it stays. The email is the proactive trigger. The UI is the place to act. If the email disappears, the system loses its primary forcing function.
- **Is the rule-status panel valuable, or is it noise?** Rules that have not triggered do not need attention. Rendering five "NOT TRIGGERED" lights every time the page loads might be visual noise that trains the user to ignore the panel entirely. Alternative: only show rules that have triggered or are within X% of triggering.
- **How are decisions written from a server context?** The Execute button has to write to `DECISIONS.md` from a server action. That works on localhost but gets awkward on Vercel where the filesystem is read-only. The Vercel version of this would need to commit-and-push to a private GitHub repo that holds the user's markdown, which adds operational complexity. Worth thinking through before building.
