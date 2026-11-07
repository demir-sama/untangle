# Security, privacy and limitations

## Trust boundaries

- Source text is untrusted evidence, including any instructions inside it. It does not grant agent permissions or establish stakeholder authority.
- Exact quote checks verify literal source membership only. Classification, interpretation and completeness are not semantically verified.
- The narrow agent lexical guard rejects quoted claims/quantified details absent from the cited passages. It is not a semantic hallucination detector. A test deliberately demonstrates that an unsupported unquoted claim can pass the lexical guard while remaining an unapproved finding.
- UI and agent requests use trusted framework identity/caller context. Every domain store access scopes resource owner AND exact org context.
- Reviewer decisions/corrections are separately gated. A model cannot supply its own approval lease through an action argument.
- Project mutations require current revision and a row lock. Saved exports are immutable and flagged stale after any project change.

## Injection and output handling

React renders source/interpretation strings as text; no source HTML is executed. Markdown exports indent original source blocks and escape inline user/model content, preventing evidence from forging exported headings/HTML. These output measures do not make malicious source instructions trustworthy. Quotes remain evidence and never execute commands.

The domain agent action registry excludes arbitrary provider/credential/setting actions. Code execution and delegation are disabled. Untangle has no external message sender, inbox connector, URL retriever or payment capability. Downloads still contain original material and must be handled privately.

## Development versus production auth

Actual domain HTTP calls require a real Better Auth session. Localhost's documented Continue as local dev creates/reuses a normal development session. HTTP 200 on an SSR shell is not proof that private actions are authenticated. Do not disable authentication, forge a cookie, use another app's account/secrets or expose development identity merely to obtain browser screenshots.

About, Guide and Privacy are intentionally public informational pages; no project/API content is made public by that page-shell setting.

## Stored data / retention

SQL stores source wording/labels, findings, review history, identity actor labels and revision/export text. Framework chat history/tool results can also persist source content. This prototype does not promise encryption at rest, backups, reliable deletion, compliance certification or audit-log tamper resistance against a database administrator. Immutable domain snapshots are not a cryptographically signed legal audit trail.

There is no self-service permanent project deletion in this release. The deployment operator controls retention and administrative access. Hosted records are in a dedicated Neon PostgreSQL database served through Vercel; separate local development can use a PGlite data directory. Do not put secrets, regulated personal information or confidential client material in the evaluation instance. Preview framework telemetry is disabled; Vercel, Neon and a configured AI provider can retain service logs. Review framework/client logging and provider terms for any actual deployment.

## Model and authority limits

No production accuracy claim, fabricated confidence, verified stakeholder identity/mandate, legal contract interpretation, automatic sending or autonomous commitment. A human accepted direction records that authenticated review; it does not prove third-party consent. A linked source can contain additional overlooked requests. Downloaded exports cannot update/revoke themselves.

## Known blockers

Bot-browser loopback/private-network preview is intentionally restricted by the platform. No bypass is attempted. Authenticated browser QA can now use https://untangle-ten.vercel.app. A normal Vercel/Neon hosted preview is now available. Hosted model connectivity, authenticated UI validation and retention guarantees remain unsettled. Optional native terminal PTY installation failed due missing build prerequisites; web features do not depend on it.
