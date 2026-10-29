import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, Reveal } from "../components/site/primitives";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { getWork } from "../lib/projects";
import { DISCIPLINES } from "./HomePage";

const BASE = import.meta.env.BASE_URL;
const TRIO = [
  { src: "assets/web/agv-assembled.webp", alt: "Render of the autonomous WIP-movement robot built at Shahi Exports", cap: "Factory floor. The WIP-movement robot, Shahi Exports." },
  { src: "assets/web/bloomingdales-feedback.webp", alt: "Customer feedback email from Bloomingdale's 59th Street", cap: "Sales floor. Customer feedback, Bloomingdale's 59th Street." },
  { src: "assets/web/cert-best-grad.webp", alt: "NIFT Certificate of Merit for the Best Graduation Project", cap: "Studio. Best Graduation Project, NIFT Delhi." },
  { src: "assets/web/art-keyart-mask.webp", alt: "Key art from the Cartier go-to-market redirection", cap: "Campaign. Key art, Cartier go-to-market redirection." },
];

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
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Systems, with taste"]} />
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

        <ul className="about__trio">
          {TRIO.map((t, i) => (
            <Reveal as="li" key={t.src} delay={0.5 + i * 0.06} className={`about__shot about__shot--${i}`}>
              <figure>
                <img src={BASE + t.src} alt={t.alt} loading="eager" />
                <figcaption>{t.cap}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

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
            <h2 className="about__asideTitle">Disciplines</h2>
            <ul className="about__list">
              {DISCIPLINES.map((d, i) => (
                <li key={d}>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="edu-title">
        <header className="sectionHead">
          <h2 id="edu-title" className="sectionHead__title">
            <Lines lines={["Education"]} />
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
          <h2 id="ctx-title" className="sectionHead__title">
            <Lines lines={["Where the work happened"]} />
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
