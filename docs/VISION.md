# Vision

Short version of the thesis behind this repo. The implementation is described in the [README](../README.md); this file is about what the implementation is trying to be.

## The gap

There is no product between the three categories of financial tools that a sophisticated DIY investor actually needs.

- **Tracking apps** (Monarch, YNAB, Copilot) show you what happened. They don't tell you what to do, and they don't know your goals or your investment philosophy.
- **Robo-advisors** (Wealthfront, Betterment) manage one account in isolation. They don't see your other accounts, your crypto, your T-bills, or your career timeline. They optimize an account, not a life.
- **Full-service wealth management** (Range, traditional RIAs) charges $3K-$10K/year. The advice is filtered through their methodology, on their platform, with their AI. You can't see why it recommends what it recommends at a deep level.

The person who reads Bogle and Bernstein, thinks about their portfolio, but still freezes during drawdowns -- the person with enough complexity to need real guidance but not enough net worth or temperament for a human advisor -- has no product built for them.

## The bet

The thing that would make a tool for this person different from the three categories above is not a better dashboard or a smarter robo. It is **persistent personal context**.

Goals, rules, philosophy, tax situation, decision history -- structured in a way an LLM can read, owned by the user, updated as life changes. An AI with access to all of that, plus live account data, plus opinionated investment literature, becomes meaningfully more useful than an AI with access to any one piece.

This pattern -- structured markdown context files that an LLM treats as long-term memory for a specific life domain -- is not finance-specific. It is the `CLAUDE.md` pattern applied to a personal domain. Finance happens to be the domain where the dollar value of better decisions is most measurable, which is why this repo starts there.

## The three layers

1. **Data** -- aggregator MCP for account balances and positions; live market data; manual markdown for whatever has no API
2. **Context** -- the markdown files that encode goals, rules, tax situation, decision history
3. **Advisory** -- an LLM that synthesizes data + context into specific, rule-driven recommendations with dollar amounts and tickers

The data layer is a commodity. The advisory layer is what users see. The context layer is the moat: six months of `DECISIONS.md` is not something a competitor can replicate by signing the user up.

## What this repo demonstrates

This repo is the MVP of the architecture above, used as a personal weekly briefing tool. It is not a product. The choices in the code reflect that:

- No UI, because the value is in the architecture, not the surface
- Mechanical rules instead of "AI judgment," because the behavioral failure mode being addressed is freezing, not lack of information
- Markdown files instead of a database, because the user owning their context is load-bearing for trust
- Anthropic API with prompt caching instead of fine-tuning, because the context evolves weekly and fine-tuning costs would dominate

## What this repo does not claim

- That this is novel. The pieces (MCP, markdown context, LLM advisory) are all standard 2026 patterns. The combination is the point.
- That this is product-ready. It is not. It is a personal tool.
- That a UI would not help. A UI would help. Whether it would help enough to justify the build is one of the questions the author is currently sitting with.

## Open questions

- Can a horizontal "personal context OS" framework generalize across finance, health, career, and other domains? Or does each domain need too much vertical expertise for the framework alone to be valuable?
- If platform AI assistants (Anthropic, OpenAI) ship native persistent memory and connectors, is this whole architecture absorbed into the platform?
- Is the moat the templates and the compounding context, or is it the proactive scheduling layer that runs context against data on a cron?
- For a tool that is fundamentally about behavior change (deploying cash during drawdowns instead of freezing), is software the right intervention at all?
