import { asset } from "../../lib/projects";
import type { Dossier } from "../../lib/dossiers";
import { Arrow, Reveal } from "../site/primitives";

/** The operational record of a project: who, when, where, with what. */
export function Glance({ d }: { d: Dossier }) {
  const rows: [string, string | undefined][] = [
    ["Role", d.glance.role],
    ["When", d.glance.when],
    ["Where", d.glance.where],
    ["With", d.glance.with],
    ["Tools", d.glance.tools],
  ];
  return (
    <dl className="glance">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="glance__row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
    </dl>
  );
}

export function Situation({ d }: { d: Dossier }) {
  return (
    <div className="situation">
      <p className="situation__lede">{d.situation.lede}</p>
      <ul className="facts">
        {d.situation.facts.map((f, i) => (
          <Reveal as="li" key={f.label} delay={i * 0.05} className="fact">
            <span className="fact__value">{f.value}</span>
            <span className="fact__label">{f.label}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/** The process, in order. The list is ordered; the order is carried by position and a line, not by printed numbers. */
export function Process({ d }: { d: Dossier }) {
  return (
    <ol className="process">
      {d.steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={Math.min(i, 3) * 0.05} className="process__step">
          <h3 className="process__title">{s.title}</h3>
          <p className="process__body">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function Results({ d }: { d: Dossier }) {
  return (
    <ul className="results2">
      {d.results.map((r, i) => (
        <Reveal as="li" key={r.label} delay={i * 0.05} className="result2">
          <span className="result2__value">{r.value}</span>
          <span className="result2__label">{r.label}</span>
          <span className="result2__how">{r.how}</span>
        </Reveal>
      ))}
    </ul>
  );
}

export function Scores({ d }: { d: Dossier }) {
  if (!d.scores) return null;
  const { a, b, rows, note } = d.scores;
  return (
    <figure className="scores">
      <div className="scores__key" aria-hidden="true">
        <span className="scores__sw scores__sw--a" /> {a}
        <span className="scores__sw scores__sw--b" /> {b}
      </div>
      <table className="scores__table">
        <caption className="visually-hidden">
          {a} and {b} scores out of 5 for each heuristic
        </caption>
        <thead className="visually-hidden">
          <tr>
            <th scope="col">Heuristic</th>
            <th scope="col">{a}</th>
            <th scope="col">{b}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, va, vb]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>
                <span className="scores__bar scores__bar--a" style={{ ["--w" as string]: va / 5 }} />
                <span className="scores__num">{va.toFixed(1)}</span>
              </td>
              <td>
                <span className="scores__bar scores__bar--b" style={{ ["--w" as string]: vb / 5 }} />
                <span className="scores__num">{vb.toFixed(1)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="scores__note">{note}</figcaption>
    </figure>
  );
}

export function Limits({ d }: { d: Dossier }) {
  if (!d.limits?.length) return null;
  return (
    <ul className="limits">
      {d.limits.map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
  );
}

export function Footage({ d }: { d: Dossier }) {
  if (!d.video) return null;
  return (
    <figure className="footage">
      <video
        src={asset(d.video.src)}
        poster={asset(d.video.poster)}
        controls
        muted
        playsInline
        loop
        preload="none"
        aria-label={d.video.caption}
      />
      <figcaption>{d.video.caption}</figcaption>
    </figure>
  );
}

export function Sources({ d }: { d: Dossier }) {
  if (!d.sources.length) return null;
  return (
    <ul className="sources">
      {d.sources.map((s) => (
        <li key={s.url}>
          <a href={s.url.startsWith("/") ? asset(s.url) : s.url} target="_blank" rel="noreferrer">
            {s.label} <Arrow />
          </a>
        </li>
      ))}
    </ul>
  );
}
