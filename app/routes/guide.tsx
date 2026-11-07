import { Link } from "react-router";

import { InfoPage } from "@/components/untangle/InfoPage";
export function meta() {
  return [{ title: "Guide · Untangle" }];
}
export default function Guide() {
  return (
    <InfoPage
      eyebrow="The working guide"
      title="From mixed instructions to an explicit next step."
      intro="Start with original words, not an AI summary. Untangle keeps the source record separate from an interpretation and from a decision."
    >
      <section>
        <h2>1. Save the agreed baseline</h2>
        <p>
          Create a project with the original scope or brief. Include constraints
          and exclusions. The source label and reported author help you identify
          it, but do not establish approval. Saved sources are immutable; if the
          baseline itself is wrong, start a new project rather than silently
          rewriting history.
        </p>
      </section>
      <section>
        <h2>2. Add the later instruction</h2>
        <p>
          Copy the original wording from a follow-up, meeting note or other
          source. Add its label and reported author. One source can contain
          several requests. Do not paste secrets. This release accepts text; it
          does not scrape linked pages, email or attachments.
        </p>
      </section>
      <section>
        <h2>3. Compare, then stage a finding</h2>
        <p>
          Open the contextual assistant from the project and ask it to inspect
          the current project. For example: “Find possible contradictions and
          added deliverables. Cite the exact passages; leave everything for my
          review.” The native assistant sees the current project through the
          same actions as the UI. Local inference can be slow, and the model can
          be wrong.
        </p>
        <p>
          You can also add a finding manually. Select its type, write what needs
          a decision, and copy contiguous source quotations. A possible conflict
          requires quotes from both the baseline and an incoming instruction.
          The server rejects invented or altered quotations.
        </p>
        <ul>
          <li>
            <strong>Possible conflict:</strong> an instruction may contradict an
            explicit baseline constraint.
          </li>
          <li>
            <strong>Possible added scope:</strong> a concrete deliverable may go
            beyond the baseline.
          </li>
          <li>
            <strong>Needs clarification:</strong> the request is vague or asks a
            question.
          </li>
          <li>
            <strong>Apparently aligned:</strong> the instruction appears
            consistent. This is still an interpretation, not an approval.
          </li>
        </ul>
      </section>
      <section>
        <h2>4. Record your decision</h2>
        <p>
          Read the evidence beside the unverified interpretation. Record a
          decision owner label and rationale. To accept, write the exact
          execution direction. You may ask for clarification, decline the
          request or keep it open. Reopen an earlier decision when new
          information arrives; its history remains.
        </p>
        <p>
          Recording a decision means you recorded it. It does not mean a named
          stakeholder has approved it. The agent cannot silently impersonate
          your review.
        </p>
      </section>
      <section>
        <h2>5. Prepare the record — nothing is sent</h2>
        <p>
          Prepare an execution brief and acknowledgment draft. They include the
          project revision, accepted directions, declined requests and
          unresolved questions. An export with unresolved findings is explicitly
          incomplete. Any later change makes saved exports stale. Previously
          downloaded files remain unchanged; check the app before using them.
        </p>
      </section>
      <section>
        <h2>If something goes wrong</h2>
        <ul>
          <li>
            <strong>“Project changed”:</strong> another action won the revision
            race. Refresh the project, check the latest state and retry
            deliberately.
          </li>
          <li>
            <strong>“Exact quote”:</strong> copy a single contiguous passage
            from the saved source, including its punctuation. Do not paraphrase
            evidence.
          </li>
          <li>
            <strong>Assistant unavailable:</strong> on the hosted preview,
            configure a supported provider connection and verify its available
            usage allowance. Only local development uses the local model
            service. Manual evidence review, decisions and exports do not depend
            on AI.
          </li>
          <li>
            <strong>Wrong AI interpretation:</strong> do not accept it. Correct
            an open interpretation or reject it with a rationale. An exact quote
            is not a verified conclusion.
          </li>
        </ul>
      </section>
      <section className="untangle-notice">
        <h2>Before using real client material</h2>
        <p>
          Read the{" "}
          <Link to="/privacy">privacy, retention and model limitations</Link>.
          This is a private, single-reviewer hackathon preview, not a production
          multi-user approval system.
        </p>
      </section>
    </InfoPage>
  );
}
