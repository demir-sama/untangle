# Hosted preview deployment

Public preview: https://untangle-ten.vercel.app . This is a non-commercial hackathon preview on existing free accounts, not a paid production service.

## Infrastructure and data

- Vercel team SAMA (sama-5806), verified Hobby plan. The user imported the existing demir-sama/untangle GitHub repository into a dedicated Untangle project. No other app was changed.
- A dedicated Neon PostgreSQL 17 project/database on a verified Free organization, in aws-us-east-1. Fixed 0.25 CU; no temporary/claimable database. Do not create another database for this app.
- Framework and Untangle production migrations passed, including an idempotent second run. The actual framework's pooled Neon adapter read the expected app tables successfully.
- The hosted health endpoint reported ready/database true, the correct app/database identity, and no authentication-origin mismatch. Anonymous access to the private list-projects action returned 401. These are HTTP/server checks, not browser interaction proof.

Sources: https://vercel.com/docs/plans/hobby and https://neon.com/pricing . Free quotas can suspend service or block writes; no upgrade, card, paid add-on or overage purchase is authorized.

## Reproducible build

Use Node **24.x**, pinned in package.json and .nvmrc. A broad engine range such as >=22.22.0 can override the Vercel project setting and select Node26; do not restore that range. Official explanation: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions .

Vercel framework preset: Other (null). Root: repository root. Install: `pnpm install --frozen-lockfile`. Build:

```sh
NITRO_PRESET=vercel AGENT_NATIVE_VERCEL_CRON_SCHEDULE='0 9 * * *' pnpm build
```

Leave Output Directory unset. The official preset emits `.vercel/output` in Build Output API v3 format. Region is iad1. The generated cron is daily because Hobby rejects the default every-minute sweep. Untangle has no product feature requiring minute-level scheduled execution. Source: https://www.agent-native.com/docs/vercel/ .

## Production configuration: names only

Private variables: DATABASE_URL (pooled application connection), BETTER_AUTH_SECRET (stable session-signing secret), CRON_SECRET (authenticated framework sweep). All are production-only Sensitive secrets. Keep their values out of Git, archives and messages. A separate direct connection was used for migrations.

Non-secret names: AGENT_NATIVE_APP_ID, APP_NAME, AGENT_MODE, BETTER_AUTH_URL, DO_NOT_TRACK, AGENT_NATIVE_TELEMETRY_DISABLED. The authentication origin is the canonical public preview URL. Preview/development environments have not been granted production credentials. No deployment-protection setting was weakened.

## Normal app authentication and hosted AI

The app retains framework Better Auth. Use normal account signup/login on the hosted app, not Continue as local dev. There is no email-delivery provider, so do not expect magic links or verified-email identity. The operator/user handles account creation and private form fields. No account/session has been created, forged or borrowed by this implementation stream. Official behavior: https://www.agent-native.com/docs/deployment/ .

After app login, the native assistant's **Use Builder.io** setup control opens its shared chooser. Select **I have a Builder.io account** for an existing account. Do not invent a direct connect URL or choose **Create and activate** without a separate account decision. These labels/flow are confirmed in the installed Agent-Native framework/toolkit source.

Builder's published Free plan is 60 credits/month with 15/day maximum: https://www.builder.io/pricing . The parent completed normal existing-account connection and observed real comparison plus contextual follow-up on that Free plan during desktop QA. This does not promise another account’s entitlement, current balance, model identity or ongoing hosted inference reliability. No paid fallback, top-up, account signup or provider key is assumed. Prompts/source context may reach the selected provider once configured; review its terms. Production never calls the development Ollama service.

## Remaining verification

- Parent-reported authenticated desktop comparison, reload persistence, clarification/stale exports, downloads and native follow-up passed. Mobile viewport could not be established after bounded attempts and remains unverified; screen-reader/contrast audit also unverified.
- Comparative retained/fresh model cases before claiming a stronger model.
- Cross-instance realtime behavior: server health reports local realtime transport, not a verified managed realtime service.
- Retention/recovery controls and operator administration are not a production guarantee.
- Runtime-log access returned 403; no alternate access workaround was attempted. Build-log reads returned 404. Do not claim a clean runtime error scan.

The earlier create-project connector denial was resolved by the user importing the app normally; updating that exact existing project's environment/build settings and deploying succeeded. No duplicate project or paid resource was created.
