import { InfoPage } from "@/components/untangle/InfoPage";
export function meta() {
  return [{ title: "Privacy & limits · Untangle" }];
}
export default function Privacy() {
  return (
    <InfoPage
      eyebrow="Privacy & limitations"
      title="Know what the record can — and cannot — say."
      intro="Use synthetic or non-sensitive material while evaluating this local prototype. Do not paste passwords, API keys, personal records, regulated information or confidential client documents."
    >
      <section>
        <h2>What is stored</h2>
        <p>
          Project titles, source text and author labels, proposed findings,
          quoted evidence, reviewer decisions and exported records are saved in
          the app’s SQL database. Every project change creates a new snapshot.
          Old source text and decision history are intentionally retained;
          changing a decision does not erase its history. Framework chat history
          may also contain prompts, source text and tool results.
        </p>
        <p>
          The current local installation uses PGlite under{" "}
          <code>data/pglite</code>. It does not promise encrypted storage,
          backups or recovery. There is no self-service permanent project
          deletion in this release. A local operator controls the data
          directory; ask them about retention before using real material.
        </p>
      </section>
      <section>
        <h2>Who can access it</h2>
        <p>
          Domain actions scope projects to the authenticated reviewer and
          organization context. This is not a shared-team approval system. Local
          development uses the framework’s development identity, not a
          production sign-in boundary: do not expose the development server to
          untrusted people or networks.
        </p>
        <p>
          Source authors and decision owners are labels supplied by the
          reviewer. Untangle does not verify that the named person wrote, saw or
          approved anything. An authenticated recorded actor is still not proof
          of a contract or stakeholder mandate.
        </p>
      </section>
      <section>
        <h2>Where inference runs</h2>
        <p>
          This installation is configured to use a local Ollama service and the
          official Qwen3-1.7B model. The configured model calls remain on the
          app host; there is no model key or paid provider in that route. The
          browser talks to the app server, not directly to Ollama.
        </p>
        <p>
          If an operator changes to a hosted provider, prompts and tool context
          can leave the machine under that provider’s terms. Review that change
          before adding real data. A hosted web app cannot automatically reach
          the local model on this machine.
        </p>
      </section>
      <section>
        <h2>Telemetry and external actions</h2>
        <p>
          The development server was launched with framework telemetry disabled.
          No advertising analytics or third-party tracking service was added to
          Untangle. Framework configuration, request logs and durable chat
          history still need a deployment-specific review; this is not a promise
          of zero logging.
        </p>
        <p>
          Untangle does not send email or client messages, retrieve inboxes,
          fetch arbitrary source links or submit approvals. Downloads are drafts
          for your review. Exported files can contain the original source text:
          keep them private.
        </p>
      </section>
      <section id="model-limits" className="scroll-mt-8">
        <h2>Model limits, openly reported</h2>
        <ul>
          <li>
            Initial six synthetic cases: <strong>3/6</strong> classifications
            correct; <strong>6/6</strong> exact quotations. Median 2.785
            seconds.
          </li>
          <li>
            Revised prompt, original six plus six new cases:{" "}
            <strong>9/12</strong> classifications correct,{" "}
            <strong>12/12</strong> exact quotations. New holdouts:{" "}
            <strong>4/6</strong>. Median 2.58 seconds.
          </li>
          <li>
            A real framework-engine → shared-action → SQL smoke test saved one
            provisional conflict in 15.81 seconds. That does not establish
            multi-turn or production reliability.
          </li>
          <li>
            The model misread a vague request, missed added scope and invented a
            baseline prohibition in an explanation. Exact quotation checks did
            not catch the bad interpretation.
          </li>
          <li>
            A later question-framing experiment scored <strong>13/20</strong>{" "}
            classifications (7/8 fresh smoke cases), with 18/20 valid
            exact-quote results. None of its 20 reasons passed the simple
            question-ending check; explanations often echoed policy and two
            outputs failed parsing. This was not a validated reliability
            improvement.
          </li>
        </ul>
        <p>
          These are tiny synthetic smoke tests, not an independent accuracy
          study. Original failures are retained in the repository’s{" "}
          <code>benchmarks/</code> results. All generated classifications and
          interpretations remain unverified until a person checks them. No
          numerical “confidence” is invented.
        </p>
      </section>
      <section>
        <h2>What safety checks actually do</h2>
        <p>
          The server checks that quotations match a saved source verbatim, that
          conflicts cite both source types, and that writes target the latest
          project revision. It protects reviewer decisions with an approval
          boundary. It does <strong>not</strong> understand whether an
          interpretation is true, complete, legally valid or authorized. Quoted
          malicious instructions remain untrusted source content.
        </p>
        <p>
          Exports have a revision stamp, not a live recall mechanism. Previously
          downloaded files cannot be updated or withdrawn automatically. Check
          the current project before relying on a download.
        </p>
      </section>
      <section>
        <h2>Deployment readiness</h2>
        <p>
          The development configuration is not a production hosting recipe.
          Public operation needs real authentication, a durable database,
          appropriate privacy/retention controls and a reachable model runtime.
          No cloud hosting, compliance certification, uptime, legal review or
          deployment completion is claimed.
        </p>
      </section>
    </InfoPage>
  );
}
