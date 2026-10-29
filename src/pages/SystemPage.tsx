import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, ProjectPlate, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Carousel } from "../components/system/Carousel";
import { Disclosure } from "../components/system/Disclosure";
import { Icon, type IconName } from "../components/system/Icon";
import { WorkCard } from "../components/system/WorkCard";
import { useContentState } from "../lib/content";
import { getWork, pad } from "../lib/projects";

const PRINCIPLES = [
  ["Outcome first", "Every project leads with its result. A recruiter scanning for eight seconds should leave with a number, a context and a discipline."],
  ["Same, but different", "One structure for every project; each discipline carries its own tone — slate for operations, oxblood for merchandising, bronze for brand."],
  ["Layers, not decoration", "Three depths only: the surface, the content, and lifted paper. Shadows mean ‘you can pick this up’."],
  ["Reveal on demand", "Long text folds away. Detail is one click deeper for those who want it, never in the way for those who don’t."],
  ["Motion follows intent", "Things move to show where you are going or what you can touch — never to decorate. All of it switches off for reduced motion."],
];

const COLORS = [
  ["Paper", "--paper", "#ECE8E1", "Base surface"],
  ["Paper 2", "--paper-2", "#E3DED5", "Desk, hover fill"],
  ["Paper 3", "--paper-3", "#D6CFC3", "Placeholder, rules"],
  ["Ink", "--ink", "#141312", "Text, primary actions"],
  ["Ink 2", "--ink-2", "#4A4641", "Secondary text"],
  ["Night", "--night", "#121110", "Dark sections"],
  ["Operations", "--ops", "#2E4757", "Discipline tone"],
  ["Merchandising", "--merch", "#8C2B1D", "Discipline tone · accent"],
  ["Brand & Product", "--brand", "#94702F", "Discipline tone"],
];

const TYPE = [
  ["Display", "Instrument Serif 400", "clamp(76 → 300px) / 0.82", "type-display", "Shreyash"],
  ["Heading 1", "Instrument Serif 400", "clamp(56 → 168px) / 0.86", "type-h1", "Selected work"],
  ["Heading 2", "Instrument Serif 400", "clamp(44 → 112px) / 0.9", "type-h2", "Three ways of working"],
  ["Heading 3", "Instrument Serif 400", "clamp(26 → 40px) / 1", "type-h3", "Approach"],
  ["Lead", "Instrument Serif 400", "clamp(22 → 32px) / 1.12", "type-lead", "I build measurable operating systems."],
  ["Body", "Inter Tight 400", "16–18px / 1.55", "type-body", "Mapped movement hotspots and constraints, then designed routing and control logic."],
  ["Label", "Inter Tight 500, caps +0.12em", "11px / 1.4", "label", "Operational systems · 01 — 10"],
];

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
const ICONS: IconName[] = ["ops", "merch", "brand", "cred", "doc", "folder", "cube", "image", "play", "globe", "plus", "chevron", "check"];

export function SystemPage() {
  const { content } = useContentState();
  const work = content ? getWork(content) : [];

  return (
    <PageShell title="Design system — Shreyash Ojha" curtainLabel="Design system">
      <section className="pageHead">
        <span className="label">Colophon · v2</span>
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Design", <em key="s">system</em>]} lineClassName={["", "pageHead__indent"]} />
        </h1>
        <p className="pageHead__lede">
          The rules this site is built from: principles, tokens and components with every state. Change a token here and the whole site follows.
        </p>
      </section>

      <SysSection n="01" title="Principles">
        <ol className="sysPrinciples">
          {PRINCIPLES.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 0.05}>
              <span className="label">{pad(i + 1)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ol>
      </SysSection>

      <SysSection n="02" title="Colour">
        <ul className="sysSwatches">
          {COLORS.map(([name, v, hex, use]) => (
            <li key={v}>
              <span className="sysSwatch" style={{ background: `var(${v})` }} />
              <strong>{name}</strong>
              <code>{v} · {hex}</code>
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </SysSection>

      <SysSection n="03" title="Type">
        <ul className="sysType">
          {TYPE.map(([name, face, size, cls, sample]) => (
            <li key={name}>
              <div className="sysType__meta">
                <strong>{name}</strong>
                <span>{face}</span>
                <code>{size}</code>
              </div>
              <div className={`sysType__sample ${cls}`}>{sample}</div>
            </li>
          ))}
        </ul>
      </SysSection>

      <SysSection n="04" title="Space, depth & motion">
        <div className="sysGrid2">
          <div>
            <p className="label">Spacing scale (px)</p>
            <ul className="sysSpace">
              {SPACE.map((s) => (
                <li key={s}>
                  <span style={{ width: s }} />
                  <code>{s}</code>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Elevation — three layers</p>
            <ul className="sysElev">
              <li className="e0"><strong>e0</strong> Surface</li>
              <li className="e1"><strong>e1</strong> Resting card</li>
              <li className="e2"><strong>e2</strong> Hover / sticky</li>
              <li className="e3"><strong>e3</strong> Lifted / overlay</li>
            </ul>
            <p className="label" style={{ marginTop: 32 }}>Motion</p>
            <ul className="sysMotion">
              <li><code>--dur-1 200ms</code> state changes</li>
              <li><code>--dur-2 450ms</code> hovers, reveals</li>
              <li><code>--dur-3 800ms</code> entrances, page curtain</li>
              <li><code>--ease cubic-bezier(.16, 1, .3, 1)</code> expo-out, everywhere</li>
            </ul>
          </div>
        </div>
      </SysSection>

      <SysSection n="05" title="Icons">
        <ul className="sysIcons">
          {ICONS.map((n) => (
            <li key={n}>
              <Icon name={n} size={28} />
              <code>{n}</code>
            </li>
          ))}
        </ul>
      </SysSection>

      <SysSection n="06" title="Buttons & states">
        <table className="sysStates">
          <thead>
            <tr>
              <th className="label">Variant</th>
              {["Default", "Hover", "Pressed", "Focus", "Disabled"].map((s) => (
                <th key={s} className="label">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["primary", "secondary", "ghost", "link"] as const).map((v) => (
              <tr key={v}>
                <td><code>{v}</code></td>
                {["", "is-hover", "is-pressed", "is-focus"].map((st) => (
                  <td key={st}>
                    <Button variant={v} className={st} icon={<Arrow dir="e" />}>Label</Button>
                  </td>
                ))}
                <td>
                  <Button variant={v} disabled icon={<Arrow dir="e" />}>Label</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sysRow">
          <p className="label">Tags</p>
          <ul className="tags">
            <li className="tag">Clienteling</li>
            <li className="tag">Systems design</li>
            <li className="tag tag--tone" data-d="ops">Operations</li>
            <li className="tag tag--tone" data-d="merch">Merchandising</li>
            <li className="tag tag--tone" data-d="brand">Brand &amp; Product</li>
          </ul>
        </div>
      </SysSection>

      <SysSection n="07" title="Cards">
        <p className="sysNote">
          Project card — default, hover, and viewed (the dot marks projects opened this session). Plates take the discipline tone when a project has no imagery, and show the project’s own key figure.
        </p>
        {work.length ? (
          <div className="sysCards">
            <div>
              <p className="label">Default</p>
              <WorkCard item={work[0]} compact />
            </div>
            <div>
              <p className="label">Hover</p>
              <WorkCard item={work[4]} compact className="is-hover" />
            </div>
            <div>
              <p className="label">Viewed</p>
              <WorkCard item={work[6]} compact viewed />
            </div>
            <div>
              <p className="label">Plate — word</p>
              <ProjectPlate meta={work[8].meta} door={work[8].door.key} label="Brand & Product" index={9} />
            </div>
          </div>
        ) : null}
      </SysSection>

      <SysSection n="08" title="Disclosure & carousel">
        <div className="sysGrid2">
          <div>
            <p className="label">Disclosure — row</p>
            <Disclosure summary="Most Innovative Project — NIFT Delhi">
              <p className="prose prose--small">Detail folds away until asked for. Used for credentials and long project briefs.</p>
            </Disclosure>
            <Disclosure summary="Open by default" defaultOpen>
              <p className="prose prose--small">The plus rotates into a cross; the panel eases open on the expo-out curve.</p>
            </Disclosure>
            <p className="label" style={{ marginTop: 28 }}>Disclosure — inline</p>
            <Disclosure variant="inline" summary="Read the full brief">
              <p className="prose prose--small">Inline variant for long paragraphs inside a section.</p>
            </Disclosure>
          </div>
          <div>
            {work.length ? (
              <Carousel label="Carousel — work cards" itemClassName="carousel__item--card">
                {work.slice(0, 6).map((w) => (
                  <WorkCard key={w.exhibit.id} item={w} compact />
                ))}
              </Carousel>
            ) : null}
          </div>
        </div>
      </SysSection>

      <SysSection n="09" title="Architecture">
        <ol className="sysIA">
          <li><strong>Lobby</strong> — Index: name, value, the desk of work, evidence.</li>
          <li><strong>Halls</strong> — Work (filter by discipline), Credentials, About.</li>
          <li><strong>Rooms</strong> — each project: banner → result → brief → approach → impact → artifacts → more work, with its own room plan (section nav).</li>
          <li><strong>Exhibitions</strong> — Cartier Rogue and Cartier × Maybach keep their own dark art direction inside the same frame.</li>
          <li><strong>Exit</strong> — every page ends in the same contact footer.</li>
        </ol>
      </SysSection>
    </PageShell>
  );
}

function SysSection(props: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="sysSection" aria-labelledby={`sys-${props.n}`}>
      <Reveal className="case__sectionHead">
        <span className="case__sectionNum">{props.n}</span>
        <h2 id={`sys-${props.n}`} className="case__sectionTitle">{props.title}</h2>
      </Reveal>
      <div className="sysSection__body">{props.children}</div>
    </section>
  );
}
