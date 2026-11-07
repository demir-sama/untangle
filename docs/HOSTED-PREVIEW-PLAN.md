# Hosted preview: verified free options and parent prerequisites

## Existing account inspection (November 7, 2026)

Sanctioned Vercel connector confirms team **SAMA**, slug **sama-5806**, on **Hobby**. Team ID: team_avuzs1VRlYPQBAmCV6hCHFWP. It returned no existing projects and no installed integration configurations, both account-level and team-scoped. GitHub CLI is authenticated as demir-sama. No Vercel CLI login is installed/assumed; no connector credentials were extracted.

Hobby is a free, non-commercial/personal tier: 100GB transfer, 4 CPU-hours and 1M function invocations included; quota exhaustion pauses service rather than authorizing an upgrade. Source: https://vercel.com/docs/plans/hobby . This hackathon preview is not a paid/commercial production hosting promise.

## Recommended persistent database: Neon Free

Official permanent Free: no card, 100 CU-hours/project, 1GB/project storage (20GB account total), 5GB/project egress, idle scale-to-zero after five minutes. Limits suspend compute/block writes rather than automatically granting paid capacity. Source (updated November 4): https://neon.com/pricing . The user subsequently connected the Neon connector. It verified organization plan `free`; a new dedicated Untangle PostgreSQL 17 project was created in aws-us-east-1 with 0.25 CU min/max. No existing data was selected or modified.

**Parent step:** open Vercel team's Storage/Marketplace and inspect Neon provisioning, or sign in to an existing Neon account at https://console.neon.tech . Create/select a new **untangle** project on an explicitly $0 Free plan (no paid plan, card or paid add-on). If this needs signup/terms, parent/user must handle it. Keep the resulting DATABASE_URL in the app's secret configuration; do not paste it into chat or borrow another app's URL. We will run framework + app production migrations against that new database before deploying.

Alternative, not yet provisioned: official Claimable Neon can create account-free PostgreSQL, capped at 100MB/1GB transfer and expiring after 72 hours. It persists between restarts but is not permanent, and claiming later rotates credentials. Source: https://neon.com/docs/reference/claimable-neon . Do not describe this as permanent storage or use it silently instead of the requested durable ownership. Parent can explicitly choose a temporary preview if desired.

## Reachable inference: no free entitlement assumed

1. Native Builder connection is the simplest framework-supported route to a larger hosted model. Official https://www.builder.io/pricing lists Free at 60 credits/month, 15/day max. Account eligibility, remaining credits and selected model must be verified in the parent's normal signed-in UI. No signup/terms, provider connection or inference usage was performed. Connect through the deployed app's normal AI/settings flow after its authenticated preview is ready. Then rerun retained cases plus new holdouts before claiming improvement.
2. Vercel AI Gateway has a free-model subset and monthly included credits, but requires a valid payment method for free credits. Remaining balance, verification and model entitlement are unknown; the connector exposes no balance tool. Do not assume this account is eligible or consume metered inference. Sources: https://vercel.com/docs/ai-gateway/pricing and https://vercel.com/docs/ai-gateway/getting-started . No card/top-up/auto-top-up is authorized.
3. A direct provider's free account/key is possible only after its current model/quota and the parent's existing account are verified. No invented key, copied app secret, guessed quota or paid fallback is acceptable.

## Production auth and hosting

The framework already includes Better Auth. An email-delivery service is optional: without one, the official deployed flow uses email/password signup/login, skips verification, and does not send magic links. No email provider needs provisioning for this synthetic preview. Parent handles the first normal app account. Do not disable authentication. Source: https://www.agent-native.com/docs/deployment/ .

Required host secrets: DATABASE_URL, one fresh stable BETTER_AUTH_SECRET, and CRON_SECRET for the generated authenticated daily sweep. Generate the latter for Untangle only; do not copy unrelated credentials. Optional public origin is inferred for Vercel previews. Parent must complete any external sign-in/terms step. No account or secret was created yet.

Official Vercel preset: `NITRO_PRESET=vercel pnpm build`. Hobby cannot run the framework's default minute cron: set `AGENT_NATIVE_VERCEL_CRON_SCHEDULE=0 9 * * *` in build environment for a daily sweep. This app does not require scheduled work; the included framework sweep still needs its own CRON_SECRET so its requests authenticate. Source: https://www.agent-native.com/docs/vercel/ . No Pro upgrade is needed or authorized.

Hosted configuration no longer selects localhost Ollama. It leaves inference to the framework's supported configured provider; local engine settings apply only in explicit development and never when VERCEL marks a hosted runtime. Tests cover this fail-closed distinction. Do not deploy a fake AI fallback if no provider is connected.

## Current checkpoint

A dedicated database has now been created through the newly connected Neon account on its verified Free plan. Production deployment is being prepared; no signup, paid resource, provider model key or inference credit has been created/consumed. A running hosted URL cannot honestly be returned until a free durable database and reachable inference entitlement are settled. The existing local server remains available to Shell, not the bot browser. Browser/mobile/Clips QA remains pending a normal hosted deployment and sign-in.

## Verified build checkpoint

The Vercel-preset production build passed with the daily cron expression. Generated `.vercel/output/config.json` is Build Output API version 3 and contains exactly the authenticated sweep path with schedule `0 9 * * *`. This is a local build artifact, not a Vercel deployment. Typecheck and framework doctor are clean; 32 tests pass, including hosted inference exclusion. Production database migrations passed against the dedicated PostgreSQL database, including a second idempotent run with AGENT_NATIVE_APP_ID=untangle. Framework schema plus the Untangle app migration were applied. Deployed authentication is not yet verified.
