import { useMemo, useState } from "react";
import "./agent.css";

/**
 * "Grade the agent" — the visitor plays the evaluator.
 * A computer-use agent replays an illustrative fashion task one step at a time; the visitor passes or flags
 * each step (and names the failure), then sees the evaluator's key and a scorecard.
 * The scenario is written for this site. Real benchmark tasks are confidential and are not reproduced here.
 */

type Dim = "execution" | "instruction" | "exception" | "integrity" | "deliverable";
const DIMS: { key: Dim; label: string }[] = [
  { key: "execution", label: "Step execution" },
  { key: "instruction", label: "Instruction adherence" },
  { key: "exception", label: "Exception handling" },
  { key: "integrity", label: "Data integrity" },
  { key: "deliverable", label: "Deliverable validation" },
];
const dimLabel = (d: Dim) => DIMS.find((x) => x.key === d)!.label;

type App = "sheet" | "oms" | "mail";
type Step = {
  app: App;
  action: string; // what the agent did, as an action log line
  says: string; // the agent's own narration
  ok: boolean;
  dim: Dim; // the dimension this step tests (or fails)
  key: string; // the evaluator's note
};

const BRIEF =
  "In stock_wk46.xlsx, find every Linen Shirts SKU at the Bandra store with under 3 weeks of cover. Raise a transfer of 6 units each from DC-Mumbai in the order system, then email the store manager the list.";

const ROWS = [
  { sku: "LS-201", name: "Linen camp shirt, white", cat: "Linen Shirts", stock: 14, rate: 3, woc: 4.7 },
  { sku: "LS-204", name: "Linen overshirt, sage", cat: "Linen Shirts", stock: 5, rate: 4, woc: 1.3 },
  { sku: "CT-118", name: "Cotton tee, black", cat: "Tees", stock: 4, rate: 5, woc: 0.8 },
  { sku: "LS-207", name: "Linen Oxford, sky", cat: "Linen Shirts", stock: 7, rate: 3.5, woc: 2.0 },
  { sku: "LS-210", name: "Linen band-collar, ecru", cat: "Linen Shirts", stock: 9, rate: 3, woc: 3.0 },
  { sku: "LS-213", name: "Linen shirt, navy", cat: "Linen Shirts", stock: 11, rate: 2, woc: 5.5 },
];

const STEPS: Step[] = [
  {
    app: "sheet",
    action: 'open_file("stock_wk46.xlsx")',
    says: "Opened the weekly stock file. Six SKUs, with weeks of cover already calculated.",
    ok: true,
    dim: "execution",
    key: "Right file, opened cleanly. Nothing to flag.",
  },
  {
    app: "sheet",
    action: 'filter(column="Category", value="Linen Shirts")',
    says: "Filtered to Linen Shirts. CT-118 is low on cover too, but it's a tee, so it's out of scope.",
    ok: true,
    dim: "instruction",
    key: "Correct. CT-118 is the trap: low cover, wrong category. The agent ignored it.",
  },
  {
    app: "sheet",
    action: "select_rows(where weeks_of_cover <= 3)",
    says: "Selected the SKUs that need stock: LS-204, LS-207 and LS-210.",
    ok: false,
    dim: "instruction",
    key: "The brief says under 3 weeks. LS-210 sits at exactly 3.0, so it should not be on the list.",
  },
  {
    app: "oms",
    action: 'create_transfer(sku="LS-204", qty=6, from="DC-Mumbai", to="Bandra")',
    says: "Raised the first transfer line.",
    ok: true,
    dim: "execution",
    key: "SKU, quantity, source and destination all match the brief.",
  },
  {
    app: "oms",
    action: 'create_transfer(sku="LS-207", qty=6, from="DC-Delhi", to="Bandra")',
    says: "Raised the second transfer line.",
    ok: false,
    dim: "integrity",
    key: "The source warehouse changed to DC-Delhi. The brief fixed it at DC-Mumbai.",
  },
  {
    app: "oms",
    action: 'on_modal("Session expired") → click("Sign in again") → verify_lines()',
    says: "The order system timed out. Signed back in through the company login and checked both lines were still saved before carrying on.",
    ok: true,
    dim: "exception",
    key: "Good recovery. It re-checked the saved state instead of re-entering lines and creating duplicates.",
  },
  {
    app: "mail",
    action: "draft_email(to=store.bandra, body=transfer_summary)",
    says: "Drafted the summary: LS-204, LS-207 and LS-210, 6 units each from DC-Mumbai.",
    ok: false,
    dim: "deliverable",
    key: "The email reports a transfer for LS-210 that was never raised, and claims DC-Mumbai for LS-207. The deliverable doesn't match the system.",
  },
  {
    app: "mail",
    action: 'send_email(to="store.bandra@…")',
    says: "Sent to the Bandra store manager.",
    ok: true,
    dim: "execution",
    key: "The send itself went to the right person. The content problem was already caught at the draft step.",
  },
];

type Answer = { verdict: "pass" | "flag"; dim?: Dim };

function stepPoints(s: Step, a: Answer | undefined) {
  if (!a) return 0;
  if (s.ok) return a.verdict === "pass" ? 10 : 0;
  if (a.verdict !== "flag") return 0;
  return a.dim === s.dim ? 15 : 10;
}
const MAX = STEPS.reduce((n, s) => n + (s.ok ? 10 : 15), 0);

export default function AgentEvalGame() {
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(Answer | undefined)[]>(() => STEPS.map(() => undefined));
  const [flagging, setFlagging] = useState(false);
  const done = i >= STEPS.length;
  const step = STEPS[Math.min(i, STEPS.length - 1)];
  const answered = answers[i];

  const score = useMemo(() => STEPS.reduce((n, s, k) => n + stepPoints(s, answers[k]), 0), [answers]);

  const answer = (a: Answer) => {
    setAnswers((prev) => prev.map((x, k) => (k === i ? a : x)));
    setFlagging(false);
  };
  const next = () => setI((n) => n + 1);
  const restart = () => {
    setAnswers(STEPS.map(() => undefined));
    setI(0);
    setFlagging(false);
    setStarted(true);
  };

  if (!started)
    return (
      <div className="ag ag--intro">
        <p className="ag__eyebrow">Interactive · about 2 minutes</p>
        <h3 className="ag__h">You're the evaluator.</h3>
        <p className="ag__p">
          An AI agent is working through a merchandising task on a desktop: a spreadsheet, an order system and email. Watch each
          step and decide: <strong>pass</strong> it, or <strong>flag</strong> it and say what went wrong. This is the kind of
          step-level judgement the benchmarks were built to test.
        </p>
        <div className="ag__brief">
          <span className="ag__briefTag">The brief the agent received</span>
          <p>{BRIEF}</p>
        </div>
        <button type="button" className="ag__btn ag__btn--primary" onClick={() => setStarted(true)}>
          Start the run
        </button>
        <p className="ag__fine">Illustrative scenario written for this portfolio. Real benchmark tasks are confidential.</p>
      </div>
    );

  if (done) {
    const pct = Math.round((score / MAX) * 100);
    const rank = pct >= 90 ? "Lead evaluator" : pct >= 70 ? "Senior reviewer" : pct >= 45 ? "Reviewer" : "Trainee";
    const caught = STEPS.filter((s, k) => !s.ok && answers[k]?.verdict === "flag").length;
    const totalFlaws = STEPS.filter((s) => !s.ok).length;
    const falseFlags = STEPS.filter((s, k) => s.ok && answers[k]?.verdict === "flag").length;
    return (
      <div className="ag ag--done" aria-live="polite">
        <div className="ag__scoreHead">
          <div>
            <p className="ag__eyebrow">Run complete</p>
            <h3 className="ag__h">{rank}</h3>
          </div>
          <div className="ag__bigScore">
            {pct}
            <small>/100</small>
          </div>
        </div>
        <ul className="ag__stats">
          <li>
            <strong>
              {caught} of {totalFlaws}
            </strong>{" "}
            failures caught
          </li>
          <li>
            <strong>{falseFlags}</strong> false alarm{falseFlags === 1 ? "" : "s"}
          </li>
          <li>
            <strong>
              {STEPS.filter((s, k) => !s.ok && answers[k]?.dim === s.dim).length} of {totalFlaws}
            </strong>{" "}
            named the right failure
          </li>
        </ul>
        <ol className="ag__review">
          {STEPS.map((s, k) => {
            const a = answers[k];
            const pts = stepPoints(s, a);
            const right = pts > 0;
            const partial = !s.ok && pts === 10;
            return (
              <li key={k} className={partial ? "is-part" : right ? "is-right" : "is-wrong"}>
                <span className="ag__reviewN">{String(k + 1).padStart(2, "0")}</span>
                <span className="ag__reviewMain">
                  <code>{s.action}</code>
                  <span>
                    {s.ok ? "Pass" : `Flag · ${dimLabel(s.dim)}`} — {s.key}
                  </span>
                </span>
                <span className="ag__reviewMark" aria-label={partial ? "Right to flag, wrong reason" : right ? "You got this right" : "You missed this"}>
                  {partial ? "½" : right ? "✓" : "✗"}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="ag__p ag__takeaway">
          The agent finished every step and sent the email, so a check on the final file alone would have passed it. Grading
          each step is what catches the threshold slip, the wrong warehouse and the report that doesn't match the system.
        </p>
        <button type="button" className="ag__btn" onClick={restart}>
          Run it again
        </button>
      </div>
    );
  }

  const correct = answered ? stepPoints(step, answered) > 0 : false;

  return (
    <div className="ag">
      <div className="ag__top">
        <span className="ag__progress" aria-label={`Step ${i + 1} of ${STEPS.length}`}>
          {STEPS.map((_, k) => (
            <span key={k} className={`ag__dot${k < i ? " is-done" : ""}${k === i ? " is-now" : ""}`} />
          ))}
        </span>
        <span className="ag__score">
          Score <strong>{score}</strong>
        </span>
      </div>

      <div className="ag__desk" aria-label="The agent's screen">
        <div className="ag__tabs" role="tablist" aria-label="Open applications">
          {(["sheet", "oms", "mail"] as App[]).map((a) => (
            <span key={a} role="tab" aria-selected={step.app === a} className={`ag__tab${step.app === a ? " is-on" : ""}`}>
              {a === "sheet" ? "stock_wk46.xlsx" : a === "oms" ? "Order system · Transfers" : "Mail · Draft"}
            </span>
          ))}
        </div>
        <div className="ag__screen">{step.app === "sheet" ? <Sheet i={i} /> : step.app === "oms" ? <Oms i={i} /> : <Mail />}</div>
        <div className="ag__log">
          <span className="ag__logTag">agent ▸</span> <code>{step.action}</code>
        </div>
      </div>

      <p className="ag__says">
        <span className="ag__saysTag">Agent:</span> “{step.says}”
      </p>

      {!answered ? (
        <div className="ag__controls">
          {!flagging ? (
            <>
              <button type="button" className="ag__btn ag__btn--pass" onClick={() => answer({ verdict: "pass" })}>
                Pass
              </button>
              <button type="button" className="ag__btn ag__btn--flag" onClick={() => setFlagging(true)}>
                Flag
              </button>
            </>
          ) : (
            <div className="ag__why">
              <p className="ag__whyQ">What went wrong?</p>
              <div className="ag__chips">
                {DIMS.filter((d) => d.key !== "execution").map((d) => (
                  <button key={d.key} type="button" className="ag__chip" onClick={() => answer({ verdict: "flag", dim: d.key })}>
                    {d.label}
                  </button>
                ))}
                <button type="button" className="ag__chip ag__chip--ghost" onClick={() => setFlagging(false)}>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`ag__verdict ${correct ? "is-right" : "is-wrong"}`} aria-live="polite">
          <p>
            <strong>{correct ? (step.ok || answered.dim === step.dim ? "Right call." : "Right to flag, wrong reason.") : "Not quite."}</strong>{" "}
            {step.ok ? "Evaluator's key: pass." : `Evaluator's key: flag, ${dimLabel(step.dim).toLowerCase()}.`} {step.key}
          </p>
          <button type="button" className="ag__btn ag__btn--primary" onClick={next}>
            {i + 1 < STEPS.length ? "Next step" : "See the scorecard"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- the three app screens, drawn from the step index ---------- */

function Sheet({ i }: { i: number }) {
  const filtered = i >= 1;
  const selected = i >= 2 ? ["LS-204", "LS-207", "LS-210"] : [];
  const rows = filtered ? ROWS.filter((r) => r.cat === "Linen Shirts") : ROWS;
  return (
    <div className="ag__sheetWrap">
      <table className="ag__sheet">
        <thead>
          <tr>
            <th>SKU</th>
            <th className="prod">Product</th>
            <th>
              Category{filtered ? <span className="ag__filter" title="Filter on"> ▾</span> : null}
            </th>
            <th className="num">Stock</th>
            <th className="num rate">Wkly sales</th>
            <th className="num">Wks cover</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sku} className={selected.includes(r.sku) ? "is-sel" : ""}>
              <td>{r.sku}</td>
              <td className="prod">{r.name}</td>
              <td>{r.cat}</td>
              <td className="num">{r.stock}</td>
              <td className="num rate">{r.rate}</td>
              <td className="num">{r.woc.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Oms({ i }: { i: number }) {
  const lines = [
    { sku: "LS-204", qty: 6, from: "DC-Mumbai" },
    { sku: "LS-207", qty: 6, from: "DC-Delhi" },
  ].slice(0, i >= 4 ? 2 : 1);
  return (
    <div className="ag__oms">
      <p className="ag__omsHead">New transfer · destination: Bandra store</p>
      <table className="ag__sheet">
        <thead>
          <tr>
            <th>Line</th>
            <th>SKU</th>
            <th className="num">Qty</th>
            <th>From</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, k) => (
            <tr key={l.sku} className={k === lines.length - 1 && i < 5 ? "is-new" : ""}>
              <td>{k + 1}</td>
              <td>{l.sku}</td>
              <td className="num">{l.qty}</td>
              <td>{l.from}</td>
              <td>Saved</td>
            </tr>
          ))}
        </tbody>
      </table>
      {i === 5 ? (
        <div className="ag__modal" role="note">
          <strong>Session expired</strong>
          <span>Please sign in again to continue.</span>
          <span className="ag__modalBtn">Sign in again</span>
        </div>
      ) : null}
    </div>
  );
}

function Mail() {
  return (
    <div className="ag__mail">
      <p>
        <span>To</span> Store Manager, Bandra
      </p>
      <p>
        <span>Subject</span> Linen transfers raised, wk46
      </p>
      <div className="ag__mailBody">
        Hi, the following transfers are raised for your store, 6 units each from DC-Mumbai:
        <br />
        LS-204, LS-207, LS-210.
        <br />
        They should arrive within two days.
      </div>
    </div>
  );
}
