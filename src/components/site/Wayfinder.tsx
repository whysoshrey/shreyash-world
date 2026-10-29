import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContentState } from "../../lib/content";
import { chapterOf, parentOf, previousLabel, projectLabel, trailFor } from "../../lib/nav";
import { Arrow } from "./primitives";

/**
 * Back: if this tab has an in-app page behind it, go there (and land at the same scroll spot);
 * otherwise go one level up the site tree. The label always says where it leads.
 */
export function BackButton(props: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = useContentState();
  if (location.pathname === "/") return null;

  const prev = previousLabel();
  const up = parentOf(location.pathname, content);
  const label = prev ?? up?.label ?? "Index";

  return (
    <button
      type="button"
      className={`backBtn ${props.className ?? ""}`}
      onClick={() => (prev ? navigate(-1) : navigate(up?.to ?? "/"))}
      aria-label={`Back to ${label}`}
      title={`Back to ${label}`}
    >
      <Arrow dir="w" />
      <span className="backBtn__text">
        Back<span className="backBtn__to"> to {label}</span>
      </span>
    </button>
  );
}

/** Where am I: the trail from the Index, plus the parts of a multi-page project. */
export function Wayfinder() {
  const { pathname } = useLocation();
  const { content } = useContentState();
  if (pathname === "/") return null;
  const trail = trailFor(pathname, content);
  const ch = chapterOf(pathname);

  return (
    <div className="wayfinder">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((c, i) =>
            i < trail.length - 1 ? (
              <li key={c.to}>
                <Link to={c.to}>{c.label}</Link>
              </li>
            ) : (
              <li key={c.to} aria-current="page">
                {c.label}
              </li>
            ),
          )}
        </ol>
      </nav>
      {ch ? <ChapterTabs /> : null}
    </div>
  );
}

/** The parts of a project told across several pages, as tabs. */
export function ChapterTabs() {
  const { pathname } = useLocation();
  const { content } = useContentState();
  const ch = chapterOf(pathname);
  if (!ch) return null;
  const name = projectLabel(content, ch.projectId);
  return (
    <nav className="chapters" aria-label={`${name}, in ${ch.chapters.length} parts`}>
      <span className="chapters__name">{name}</span>
      <ol className="chapters__list">
        {ch.chapters.map((c, i) => (
          <li key={c.to}>
            <Link to={c.to} className={`chapters__tab${i === ch.index ? " is-current" : ""}`} aria-current={i === ch.index ? "page" : undefined}>
              {c.label}
            </Link>
          </li>
        ))}
      </ol>
      <span className="chapters__pos">
        Part {ch.index + 1} of {ch.chapters.length}
      </span>
    </nav>
  );
}

/** End of a chapter: the way on, the way back, and the whole project at a glance. */
export function ChapterPager() {
  const { pathname } = useLocation();
  const { content } = useContentState();
  const ch = chapterOf(pathname);
  if (!ch) return null;
  const name = projectLabel(content, ch.projectId);
  const prev = ch.chapters[ch.index - 1];
  const next = ch.chapters[ch.index + 1];

  return (
    <section className="pager" aria-labelledby="pager-title">
      <h2 id="pager-title" className="pager__title">
        {next ? "Keep reading" : `That’s the whole of ${name}`}
      </h2>
      <div className="pager__grid">
        {prev ? (
          <Link to={prev.to} className="pager__card pager__card--prev">
            <span className="pager__name">{prev.label}</span>
            <span className="pager__blurb">{prev.blurb}</span>
          
            <span className="pager__dir">
              <Arrow dir="w" /> Previous part
            </span>
          </Link>
        ) : (
          <Link to="/work" className="pager__card pager__card--prev">
            <span className="pager__name">Selected work</span>
            <span className="pager__blurb">Every project, filterable by discipline.</span>
          
            <span className="pager__dir">
              <Arrow dir="w" /> All work
            </span>
          </Link>
        )}
        {next ? (
          <Link to={next.to} className="pager__card pager__card--next">
            <span className="pager__name">{next.label}</span>
            <span className="pager__blurb">{next.blurb}</span>
          
            <span className="pager__dir">
              Next part <Arrow dir="e" />
            </span>
          </Link>
        ) : (
          <Link to={ch.chapters[0].to} className="pager__card pager__card--next">
            <span className="pager__name">{ch.chapters[0].label}</span>
            <span className="pager__blurb">{ch.chapters[0].blurb}</span>
          
            <span className="pager__dir">
              Back to the start <Arrow dir="e" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
