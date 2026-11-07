import { Link } from "react-router";

import { InfoPage } from "@/components/untangle/InfoPage";
export function meta() {
  return [
    { title: "About · Untangle" },
    {
      name: "description",
      content:
        "Why Untangle puts source evidence and human decisions in the same workspace.",
    },
  ];
}
export default function About() {
  return (
    <InfoPage
      eyebrow="Why Untangle exists"
      title="A request is not an agreement."
      intro="Project instructions arrive in fragments. The costly part is not collecting another comment — it is knowing which direction the team has actually agreed to follow."
    >
      <section>
        <h2>One desk for the difficult middle</h2>
        <p>
          Untangle helps project leads and client-facing teams compare later
          instructions with an agreed scope. It brings the original words,
          possible contradictions, and the person’s decision together. It is a
          decision record, not a general task board or a legal approval service.
        </p>
      </section>
      <section>
        <h2>Evidence first. People decide.</h2>
        <ol>
          <li>
            <strong>Establish the baseline.</strong> Preserve the original
            scope, constraints and exclusions.
          </li>
          <li>
            <strong>Compare what came later.</strong> Link each proposed finding
            to exact source passages, side by side.
          </li>
          <li>
            <strong>Make the direction explicit.</strong> A reviewer records the
            outcome, decision-owner label and rationale. Accepting requires a
            concrete execution direction.
          </li>
          <li>
            <strong>Carry the record forward.</strong> Export a revision-bound
            brief and an acknowledgment draft. If the project changes, old
            exports are marked stale.
          </li>
        </ol>
      </section>
      <section>
        <h2>An agent working in the same place</h2>
        <p>
          Built on Builder.io’s Agent-Native framework. The interface and
          assistant use the same typed actions and SQL state. The assistant can
          read the current project and stage evidence-backed findings. It cannot
          manufacture a human decision: a decision tool call needs the
          framework’s exact-call human approval gate. Arbitrary code execution
          and external sending are not part of this product.
        </p>
      </section>
      <section className="untangle-notice">
        <h2>Useful does not mean infallible</h2>
        <p>
          The free local model is small. In a revised 12-case synthetic smoke
          test, it classified 9 correctly; on the six new holdouts, only 4. It
          also produced an unsupported explanation while copying valid
          quotations. Source matching verifies the quote, not the
          interpretation. All model suggestions need human review. We do not
          show fabricated confidence scores or claim production accuracy.
        </p>
        <Link to="/privacy#model-limits">
          Read the limits and evaluation record →
        </Link>
      </section>
      <section>
        <h2>Deliberate boundaries</h2>
        <p>
          This release is a private, single-reviewer workspace. Source author
          and decision-owner labels are descriptive, not verified identities or
          authority. There is no inbox scraping, stakeholder identity
          verification, automatic sending, contract interpretation or promise
          that every conflicting instruction will be found.
        </p>
        <p>
          Untangle is an independently built hackathon prototype. It uses the
          actual Agent-Native framework; no affiliation or endorsement is
          implied.
        </p>
      </section>
    </InfoPage>
  );
}
