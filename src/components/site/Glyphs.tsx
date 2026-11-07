/**
 * Custom plate iconography: original hairline illustrations, one per project that has no photography.
 * Drawn in currentColor so each plate keeps its door colour; ".f" marks soft tinted fills, ".a" the accent stroke.
 */
import type { ReactNode } from "react";

export type GlyphKey =
  | "needle" | "loom" | "dashboard" | "layout" | "gauge" | "storefront" | "fibres" | "spectrum"
  | "cycle" | "gantt" | "conveyor" | "phone" | "market" | "hanger" | "ticket" | "screens" | "human";

const G: Record<GlyphKey, ReactNode> = {
  /* IoT needle tracker: machine head, needle, sensor and signal */
  needle: (
    <>
      <path d="M70 250V150q0-30 30-30h170q30 0 30 30v40H150v60" />
      <rect className="f" x="60" y="250" width="280" height="30" />
      <path d="M150 190v40M150 230l-4 14h8z" />
      <rect className="a" x="232" y="200" width="44" height="26" />
      <circle cx="246" cy="213" r="5" /><circle cx="262" cy="213" r="5" />
      <path className="a" d="M300 120q22 18 0 36M318 104q40 34 0 68M336 88q58 50 0 100" />
      <path d="M60 330h280" strokeDasharray="3 7" />
      <path d="M90 316v-14M130 316v-26M170 316v-8M210 316v-34M250 316v-20M290 316v-30" />
    </>
  ),
  /* Weaving: warp lines, weft shuttle, offcut pile */
  loom: (
    <>
      <path d="M90 80h220M90 260h220" />
      {[110, 135, 160, 185, 210, 235, 260, 285].map((x) => <path key={x} d={`M${x} 80v180`} />)}
      <path className="a" d="M90 150c40-14 80 14 110 0s80-14 110 0M90 180c40-14 80 14 110 0s80-14 110 0" />
      <path className="f" d="M150 300l40-12 50 14-20 22-60 4z" />
      <path d="M120 330c20-20 40 6 60-10M230 330c16-14 34 4 50-8" />
      <text x="310" y="325" className="t">kg</text>
    </>
  ),
  /* Sales dashboard: bars, trend line, KPI tiles */
  dashboard: (
    <>
      <rect x="60" y="70" width="280" height="260" />
      <path d="M60 110h280" />
      <rect className="f" x="80" y="128" width="70" height="40" />
      <rect className="f" x="165" y="128" width="70" height="40" />
      <rect className="f" x="250" y="128" width="70" height="40" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={86 + i * 24} y={300 - [40, 70, 55, 95, 80, 110][i]} width="14" height={[40, 70, 55, 95, 80, 110][i]} />)}
      <path className="a" d="M240 290l20-30 22 12 20-46 18 8" />
      <circle cx="320" cy="234" r="4" />
    </>
  ),
  /* Line layout: machine grid with WIP flow */
  layout: (
    <>
      <rect x="60" y="70" width="280" height="260" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} className={(r + c) % 3 ? "" : "f"} x={84 + c * 50} y={96 + r * 58} width="30" height="22" />))}
      <path className="a" d="M99 130v28h200v30H99v28h200" fill="none" />
      <path className="a" d="M290 236l12 8-12 8" />
    </>
  ),
  /* Operator rating: dial with A / B / C bands */
  gauge: (
    <>
      <path d="M80 270a120 120 0 0 1 240 0" />
      <path className="f" d="M80 270a120 120 0 0 1 60-104l30 52a60 60 0 0 0-30 52z" />
      <path d="M140 166a120 120 0 0 1 120 0M260 166a120 120 0 0 1 60 104" />
      <path className="a" d="M200 270l70-86" />
      <circle cx="200" cy="270" r="10" />
      <text x="100" y="300" className="t">C</text><text x="194" y="132" className="t">B</text><text x="290" y="300" className="t">A</text>
      <path d="M120 330h160" strokeDasharray="3 7" />
    </>
  ),
  /* Retail intervention: storefront, RFID tag, scan beam */
  storefront: (
    <>
      <path d="M60 140h280v190H60zM60 140l20-50h240l20 50" />
      <path d="M90 140v-50M140 140v-50M190 140v-50M240 140v-50M290 140v-50" />
      <rect x="90" y="180" width="100" height="150" />
      <rect className="f" x="220" y="180" width="90" height="70" />
      <path d="M252 280l18-24 18 24v34h-36z" />
      <circle cx="270" cy="270" r="4" />
      <path className="a" d="M120 210c20 14 20 46 0 60M136 198c30 22 30 62 0 84" />
      <path d="M250 300h40" />
    </>
  ),
  /* Fibre mix: swatch stack, cotton boll, recycle loop */
  fibres: (
    <>
      <rect className="f" x="70" y="200" width="150" height="40" />
      <rect x="70" y="244" width="110" height="40" />
      <rect x="70" y="288" width="60" height="40" />
      <circle cx="140" cy="120" r="22" /><circle cx="170" cy="104" r="22" /><circle cx="170" cy="140" r="22" />
      <path d="M156 160v30" />
      <path className="a" d="M300 120a50 50 0 1 1-46-30M254 90l14-12M254 90l16 8" />
      <path d="M260 300h70M260 280h50M260 260h30" />
    </>
  ),
  /* NIR sorting: spectrum with four peaks over fabric strips */
  spectrum: (
    <>
      <path d="M60 300h280M60 300V80" />
      <path className="a" d="M60 260c40 0 50-130 80-130s40 120 70 120 30-90 50-90 30 110 80 110" />
      <path d="M60 270c40 0 60-90 92-90s40 80 70 80 36-60 56-60 26 80 62 80" strokeDasharray="4 6" />
      {[140, 200, 260, 310].map((x) => <path key={x} d={`M${x} 300v12`} />)}
      <rect className="f" x="80" y="326" width="56" height="18" /><rect x="146" y="326" width="56" height="18" />
      <rect className="f" x="212" y="326" width="56" height="18" /><rect x="278" y="326" width="56" height="18" />
    </>
  ),
  /* Waste systems: three-arrow loop around scraps */
  cycle: (
    <>
      <path className="a" d="M200 90a110 110 0 0 1 95 55M295 255a110 110 0 0 1-190 0M105 145a110 110 0 0 1 60-50" />
      <path d="M283 128l12 17-20 4M120 270l-15-15 21-3M150 104l15-9-4 19" />
      <path className="f" d="M170 200l26-24 34 10 6 30-30 18-30-10z" />
      <path d="M182 186l40 28M178 214l48-30" />
      <text x="190" y="340" className="t">3R</text>
    </>
  ),
  /* PLM and planning: tech pack beside a Gantt chart */
  gantt: (
    <>
      <rect x="60" y="80" width="120" height="240" />
      <path d="M90 120l20-14h40l20 14-10 20-12-6v70h-36v-70l-12 6z" />
      <path d="M78 250h84M78 270h60M78 290h72" />
      <path d="M210 100v220M210 320h130" />
      <rect className="f" x="220" y="120" width="60" height="18" />
      <rect x="250" y="150" width="70" height="18" />
      <rect className="f" x="270" y="180" width="50" height="18" />
      <rect x="230" y="210" width="40" height="18" />
      <rect className="f" x="280" y="240" width="56" height="18" />
      <path className="a" d="M280 129h-10v30M320 159v30M270 219h10v30" />
    </>
  ),
  /* Packing station: two conveyors, falling pieces, sealed box */
  conveyor: (
    <>
      <path d="M60 140h180M60 160h180" /><circle cx="70" cy="150" r="10" /><circle cx="230" cy="150" r="10" />
      <rect className="f" x="110" y="118" width="26" height="22" /><rect x="160" y="118" width="26" height="22" />
      <path className="a" d="M246 150q24 4 26 40M262 168v4M266 184v4" />
      <path d="M140 280h220M140 300h220" /><circle cx="150" cy="290" r="10" /><circle cx="350" cy="290" r="10" />
      <path d="M232 200h80v80h-80zM232 200l-14-18M312 200l14-18" />
      <text x="258" y="250" className="t">20</text>
      <rect x="320" y="100" width="22" height="34" /><path className="a" d="M330 134l-46 60" strokeDasharray="3 5" />
    </>
  ),
  /* Digital audit: phone, AR frame, bag */
  phone: (
    <>
      <rect x="130" y="60" width="140" height="280" rx="18" />
      <path d="M180 76h40" />
      <path className="a" d="M150 120h20M150 120v20M250 120h-20M250 120v20M150 260h20M150 260v-20M250 260h-20M250 260v-20" />
      <path className="f" d="M172 170h56l10 70h-76z" />
      <path d="M186 170a14 14 0 0 1 28 0" />
      <path d="M300 120l30-10M300 190h40M300 260l30 10" strokeDasharray="3 6" />
      <circle cx="200" cy="316" r="8" />
    </>
  ),
  /* Marketplace: grid of independent label shopfronts */
  market: (
    <>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <g key={`${r}${c}`} transform={`translate(${70 + c * 92} ${70 + r * 92})`}>
          <rect className={(r * 3 + c) % 4 === 0 ? "f" : ""} width="76" height="76" />
          <path d="M0 20h76M14 20l6-12h36l6 12" />
          <path d="M26 64v-22h24v22" />
        </g>
      )))}
      <path className="a" d="M162 162l-30-30M254 254l30 30" />
    </>
  ),
  /* Clienteling: hanger, garment, client card */
  hanger: (
    <>
      <path d="M150 90a20 20 0 1 1 20 20v14l-110 70h220l-110-70" />
      <path d="M90 194l-10 140h180l-10-140" />
      <path className="f" d="M150 194l20 40 20-40" />
      <rect x="250" y="210" width="96" height="120" />
      <path className="a" d="M264 236h68M264 258h50M264 280h60" />
      <circle cx="298" cy="310" r="8" />
    </>
  ),
  /* Event launch: ticket stub with timer */
  ticket: (
    <>
      <path d="M60 120h280v50a30 30 0 0 0 0 60v50H60v-50a30 30 0 0 0 0-60z" />
      <path d="M250 120v160" strokeDasharray="4 6" />
      <circle cx="150" cy="200" r="50" />
      <path className="a" d="M150 200v-34M150 200l22 14" />
      <path className="f" d="M150 150a50 50 0 0 1 43 25l-43 25z" />
      <path d="M140 140h20" />
      <path d="M278 170h40M278 200h30M278 230h40" />
    </>
  ),
  /* UX study: two phone screens with laws applied */
  screens: (
    <>
      <rect x="70" y="70" width="120" height="240" rx="14" />
      <rect x="210" y="90" width="120" height="240" rx="14" />
      <rect className="f" x="86" y="100" width="88" height="60" />
      <path d="M86 180h88M86 200h60M86 220h74" />
      <rect x="226" y="120" width="88" height="40" />
      <rect className="f" x="226" y="170" width="40" height="40" /><rect x="274" y="170" width="40" height="40" />
      <path className="a" d="M190 250c20 0 20-40 40-40" />
      <path d="M226 230h88M226 250h56" />
    </>
  ),
  /* Human-centred campaign: profile in a quote frame */
  human: (
    <>
      <path d="M200 90c46 0 70 36 66 76-2 22-16 34-16 50 0 14 14 24 14 40v74H130v-60c-20-6-30-26-24-48l8-28c-10-8-6-24 6-26 6-46 34-78 80-78z" />
      <path className="f" d="M150 330v-60c30 10 60 10 90-10v70z" />
      <path className="a" d="M70 90q-10 30 10 40M90 90q-10 30 10 40M310 270q10-30-10-40M330 270q10-30-10-40" />
      <path d="M60 340h280" />
    </>
  ),
};

export function PlateGlyph({ name }: { name: GlyphKey }) {
  return (
    <svg className="plate__glyph" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {G[name]}
    </svg>
  );
}
