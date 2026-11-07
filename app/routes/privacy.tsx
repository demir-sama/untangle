import { InfoPage } from "@/components/untangle/InfoPage";
export function meta() {
  return [{ title: "Privacy & limits · Untangle" }];
}
export default function Privacy() {
  return (
    <InfoPage
      eyebrow="Privacy & limitations"
      title="Know what the record can — and cannot — say."
      intro="Use synthetic or non-sensitive material while evaluating this preview. Do not paste passwords, API keys, personal records, regulated information or confidential client documents."
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
          The hosted preview runs on Vercel and stores records in a dedicated
          Neon PostgreSQL database, not in the browser or temporary function
          files. A separate local installation can use PGlite under{" "}
          <code>data/pglite</code>. There is no self-service permanent project
          deletion in this release. The deployment operator controls retention
          and access to stored records; ask about retention and recovery before
          using real material.
        </p>
      </section>
      <section>
        <h2>Who can access it</h2>
        <p>
          Domain actions scope projects to the authenticated reviewer and
          organization context. This is not a shared-team approval system. The
          hosted preview requires a normal account session. A separate local
          development installation has a local-only sign-in option; do not
          expose that development server to untrusted people or networks.
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
          Hosted AI requires a configured Builder.io or other supported provider
          connection. When you use that connection, prompts, source passages,
          chat context and tool results may be transmitted to the selected
          provider under its terms. Review the provider and its retention policy
          before submitting material. No hosted model accuracy or free-credit
          entitlement is assumed.
        </p>
        <p>
          Only an explicit, non-hosted development installation can select the
          local Ollama/Qwen model used in the earlier smoke tests. The hosted
          preview does not call that local service. Manual review and exports do
          not require an AI provider connection.
        </p>
      </section>
      <section>
        <h2>Telemetry and external actions</h2>
        <p>
          Framework telemetry is disabled in the preview configuration. No
          advertising analytics or third-party tracking service was added to
          Untangle. Vercel, Neon and a selected AI provider may retain service
          or diagnostic logs under their policies. Framework chat history can
          retain submitted context. This is not a promise of zero logging.
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
          This is a hosted hackathon preview, not a production service with an
          uptime or recovery guarantee. Its SQL health and anonymous action
          boundary have been checked, but complete authenticated desktop/mobile
          flows and hosted model reliability still require validation. No
          independent security audit, compliance certification or legal review
          is claimed.
        </p>
      </section>
    </InfoPage>
  );
}
