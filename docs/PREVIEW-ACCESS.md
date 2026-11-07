# Browser preview access — confirmed platform restriction

Shell requests to http://localhost:8092/projects return HTTP 200 and the process listens on all interfaces. box-doctor passes 11 checks. Parent browser localhost refuses connections; the private interface address returns 403. This is not evidence that the application server is down.

An official Cursor forum staff reply confirms that bot-browser loopback blocking is an intentional security change introduced with the current computer image on November 6, 2026. Public thread: https://forum.cursor.com/t/grok-bot-browser-blocked-from-loopback-127-0-0-1-since-nov-6-local-services-unreachable-shell-fine/177563 . Staff reply November 7 at 11:32 WAT: the browser can only use its built-in proxy on loopback; Shell is unaffected. Another participant reports the exact local-game-preview problem. The thread contains no sanctioned bot-local preview exception or supported alternate local URL.

No firewall/proxy/browser/CDP/credential controls were changed, and no tunnel/private-hostname workaround was attempted. Do not repeatedly restart the healthy app or vary local/private addresses to evade the restriction. Browser QA on the bot-local app remains BLOCKED.

A normal public deployment is a separate supported product-hosting activity, not a private-network bypass, but this app needs production authentication, durable SQL and a reachable model runtime first. Do not expose the development identity, model server, data or secrets merely to obtain a screenshot. A registered user computer/local execution would require the user's explicit approval and is not configured by this document.

Current verification can cover code, HTTP/API responses, typed actions and SQL via Shell; it cannot claim rendered UI/mobile/browser interaction evidence. Parent must select an approved supported hosting/local-execution route for visual QA or obtain platform support guidance. No outreach was sent.

## Authentication prerequisite

The app's actual shared-action endpoint returns Unauthorized to a cookie-less request, even though the SSR page returns 200. The earlier claim that local requests automatically had an authenticated local sentinel was incorrect. Official https://www.agent-native.com/docs/authentication/ documents **Continue as local dev** on the sign-in screen, creating a real Better Auth dev session on the canonical localhost origin. No such session was created or copied. Do not disable auth, fabricate sessions, borrow another app's cookies or extract credentials to make chat tests pass. Full HTTP/native browser chat remains unverified until normal sign-in on a supported reachable browser/deployment. About/Guide/Privacy are deliberately public information pages; domain actions remain authenticated.
