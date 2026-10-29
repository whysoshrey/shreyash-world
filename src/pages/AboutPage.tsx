import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, Reveal } from "../components/site/primitives";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { getWork, pad } from "../lib/projects";
import { DISCIPLINES } from "./HomePage";

const EDUCATION = [
  { school: "Parsons School of Design, The New School", degree: "MPS Fashion Management", note: "MANGO Scholarship Award · Featured on the Parsons student-work site" },
  { school: "National Institute of Fashion Technology, Delhi", degree: "B.F.Tech", note: "Best Graduation Project · Most Innovative Project · Most Commercially Viable Project" },
];

export function AboutPage() {
  const { content } = useContentState();
  if (!content) return <PageShell title="About — Shreyash Ojha">{null}</PageShell>;
  const work = getWork(content);

  return (
    <PageShell title="About — Shreyash Ojha" curtainLabel="About">
      <section className="pageHead about__head">
        <span className="label">About</span>
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Systems,", <em key="s">with taste.</em>]} lineClassName={["", "pageHead__indent"]} />
        </h1>
      </section>

      <section className="about">
        <motion.p
          className="about__statement"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 1, ease: easeOutExpo } }}
        >
          {content.site.positioning}. {content.site.valueProp}
        </motion.p>

        <div className="about__cols">
          <Reveal className="about__bio">
            <p>
              My work spans fashion management, retail strategy, product development and applied technology. On production floors I have
              built automation and instrumentation — an autonomous WIP-movement robot during an Industry 4.0 fellowship at Shahi Exports,
              presented at Bharat Tex 2024, and an IoT needle time-tracker with management dashboards at Inzex Textiles.
            </p>
            <p>
              At Welspun India I worked on eliminating a recurring stream of loom hard waste. On the luxury sales floor at Bloomingdale’s
              59th Street I practised clienteling and fit resolution. And in brand work — from a Cartier go-to-market redirection to an
              Off-White campaign concept — I carry the same discipline: a clear problem, a structured approach, and outcomes that can be
              measured.
            </p>
          </Reveal>

          <Reveal className="about__aside" delay={0.1}>
            <p className="label">Disciplines</p>
            <ul className="about__list">
              {DISCIPLINES.map((d, i) => (
                <li key={d}>
                  <span className="label">{pad(i + 1)}</span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="edu-title">
        <header className="sectionHead">
          <span className="label">(01)</span>
          <h2 id="edu-title" className="sectionHead__title">
            <Lines lines={[<em key="e">Education</em>]} />
          </h2>
        </header>
        <ul className="eduList">
          {EDUCATION.map((e, i) => (
            <Reveal as="li" key={e.school} delay={i * 0.08} className="eduItem">
              <span className="eduItem__degree">{e.degree}</span>
              <span className="eduItem__school">{e.school}</span>
              <span className="eduItem__note label">{e.note}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="ctx-title">
        <header className="sectionHead">
          <span className="label">(02)</span>
          <h2 id="ctx-title" className="sectionHead__title">
            <Lines lines={["Where the", <em key="w">work happened</em>]} />
          </h2>
        </header>
        <ul className="ctxList">
          {work.map((w, i) => (
            <Reveal as="li" key={w.exhibit.id} delay={Math.min(i, 5) * 0.04}>
              <Link to={`/work/${w.exhibit.id}`} className="ctxRow">
                <span className="ctxRow__ctx">{w.exhibit.context}</span>
                <span className="ctxRow__title">{w.exhibit.title}</span>
                <Arrow dir="e" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
