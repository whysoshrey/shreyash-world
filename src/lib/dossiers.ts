/**
 * Project dossiers: the operational detail behind each case study, drawn from the project's own documents
 * (reports, decks and dissertation on Drive) and the latest résumé.
 *
 * Evidence rules, carried over from the career-profile assessment:
 *  - "What changed" figures say how they were obtained. Factory results after the original reports were
 *    measured by the on-floor team, with Shreyash observing and recording; the source records are not public.
 *  - Targets, modelled figures and derived scores are labelled as such, never presented as outcomes.
 *  - Nothing here is invented to fill a gap: where a document doesn't say, the dossier doesn't either.
 */

export type Fact = { value: string; label: string };
export type Step = { title: string; body: string };
export type Result = { value: string; label: string; how: string };
export type Shot = { src: string; caption: string; ratio: string };
export type Source = { label: string; url: string };

export type Dossier = {
  glance: { role: string; when: string; where: string; with?: string; tools: string };
  situation: { lede: string; facts: Fact[] };
  steps: Step[];
  results: Result[];
  /** optional scored comparison (UX benchmark) */
  scores?: { title: string; a: string; b: string; rows: [string, number, number][]; note: string };
  limits?: string[];
  video?: { src: string; poster: string; caption: string };
  shots?: Shot[];
  sources: Source[];
};

const s = (file: string, caption: string, ratio: string): Shot => ({ src: `/assets/web/${file}.webp`, caption, ratio });
const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const DOSSIERS: Record<string, Dossier> = {
  /* ------------------------------------------------------------------ */
  "ops-1": {
    glance: {
      role: "Technical lead on a two-person dissertation: all wiring, IoT design, RFID routing logic and technical deployment",
      when: "January – July 2024",
      where: "Shahi Exports, Industry 4.0 Research Fellowship (Shahi Chair, NIFT Delhi)",
      with: "Dissertation co-authored with a classmate; post-pilot measurement by the factory floor team",
      tools: "Arduino Mega, ESP32 web interface, PN532 RFID reader, line sensor, ultrasonic sensor on a servo, Arduino C++, HTML/JS",
    },
    situation: {
      lede:
        "On the factory floor studied, cut bundles leave a basement cutting room in crates, ride a shared passenger lift, and are wheeled by hand to the sewing lines. The lift is the bottleneck: when it is busy, line helpers are pulled off their work to carry crates up the stairs.",
      facts: [
        { value: "16", label: "sewing lines fed from one cutting room" },
        { value: "64", label: "crate deliveries a day, about four per line" },
        { value: "60 kg", label: "moved per trip: a 40 kg crate on a 20 kg trolley" },
        { value: "80–120 ft", label: "from the lift to each line" },
      ],
    },
    steps: [
      {
        title: "Studied the route before designing anything",
        body:
          "Interviewed the factory's senior IE manager and mapped the cutting-to-sewing route: who carries what, how far, how often, and where it stalls. Scoped the robot to the first leg (rack to line input table), leaving intra-line movement for later.",
      },
      {
        title: "Chose a navigation method a factory can maintain",
        body:
          "Compared approaches and rejected magnetic guide tape. Settled on a painted line for path-keeping plus RFID tags at loading, unloading and junction points. A graph-based shortest-path planner was researched and then dropped as too complex for the floor.",
      },
      {
        title: "Built the robot",
        body:
          "Four 12 V geared motors and a 20 kg payload deck. An Arduino Mega handles control, and an ESP32 hosts a web page from which one operator calls the robot to a station. An ultrasonic sensor sweeps on a servo for obstacles, with a kill switch and an LCD for status.",
      },
      {
        title: "Broke it, diagnosed it, fixed it",
        body:
          "Eight motors failed in testing: misaligned gearboxes put sideways load on the shafts, and the first fix (metal clamps) warped the shaft and burned the coils. The answer was a central support caster that takes weight off the motor shafts. The RFID reader also had to move away from the aluminium plates, which were detuning its signal.",
      },
      {
        title: "Piloted it and made the business case",
        body:
          "After the dissertation, the robot moved into a floor pilot. The floor team measured it while I observed and recorded. I mapped 14 workflows and analysed 15,000+ movement events, built a 12-month ROI case, and presented the trade-offs to senior management, production and engineering.",
      },
    ],
    results: [
      { value: "22%", label: "less material movement", how: "Pilot vs. existing process, measured by the floor team" },
      { value: "18%", label: "shorter transfer cycles", how: "Same start and end points, before vs. pilot" },
      { value: "92%", label: "route reliability", how: "Routes completed in pilot runs; not a long-run uptime figure" },
      { value: "3", label: "NIFT awards, October 2024", how: "Best Graduation Project, Most Innovative Project, Most Commercially Viable Project" },
    ],
    limits: [
      "The prototype carries 20 kg and a full crate weighs 40 kg, so deployment needs a bigger deck or two robots per run.",
      "With load it travels at about 0.2 m/s (40 RPM); speed was traded for stability.",
      "Long-run reliability (MTBF/MTTR) needs about three months of operation, beyond the project's timeframe.",
      "The control logic can't yet say which component has failed; diagnosis is manual.",
    ],
    video: { src: "/assets/web/acme-prototype.mp4", poster: "/assets/web/acme-prototype-poster.webp", caption: "The finished prototype, filmed after assembly" },
    shots: [
      s("acme-build", "Wiring and drive train, seen from above", "720 / 1280"),
      s("acme-bench", "Bench testing the control code against the chassis", "1600 / 900"),
      s("acme-drawings", "Fabrication drawings for the chassis", "1776 / 806"),
      s("agv-exploded", "Exploded view: chassis, electronics bay, payload plate", "750 / 720"),
    ],
    sources: [
      { label: "ACME dissertation, NIFT Delhi, May 2024 (99 pages)", url: drive("1cWLt55gFnziJ50tH_0GH9FJ-ZZaMy0_Q") },
      { label: "Presentation at Bharat Tex", url: drive("1QU_vI47lLPdXV8sfeGPbfxwZ-jTlaZ04") },
      { label: "Interactive 3D reconstruction of the robot", url: "/projects/acme-agv-3d.html" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "ops-2": {
    glance: {
      role: "Designed and built the tracker: sensing, firmware, cloud logging and the reading of the data",
      when: "June – July 2022 (internship); written up in May 2024",
      where: "INZEX Textiles, sewing floor",
      tools: "NodeMCU ESP8266, HC-SR04 ultrasonic sensor, Arduino IDE, Google Apps Script, Google Sheets",
    },
    situation: {
      lede:
        "Supervisors judged sewing efficiency by walking the line. Industrial monitoring systems were too expensive to put on every machine, so bottlenecks showed up late, in end-of-day counts.",
      facts: [
        { value: "< ₹400", label: "hardware cost per machine" },
        { value: "15 cm", label: "detection range set at the sewing pedal" },
        { value: "10 ms", label: "sampling interval" },
        { value: "0", label: "manual entries: every pedal press is logged automatically" },
      ],
    },
    steps: [
      {
        title: "Picked a signal that stands in for work",
        body:
          "Compared work sampling, time-and-motion studies, predetermined time systems and RFID tracking. Each was either costly, disruptive or too coarse. Pedal engagement time is a cheap, continuous proxy for needle running time.",
      },
      {
        title: "Built the sensor",
        body:
          "An HC-SR04 sensor sits by the pedal. When the pedal enters its 15 cm range the NodeMCU starts a timer, and when it leaves, the duration is one activity event.",
      },
      {
        title: "Sent every event to the cloud",
        body:
          "The controller posts each event over Wi-Fi to a Google Apps Script web app, which writes date, time and duration into a sheet. No one types anything.",
      },
      {
        title: "Tested it on a working machine",
        body: "Mounted on a test machine on the floor to check that logged intervals matched real pedal use.",
      },
      {
        title: "Turned seconds into a number a supervisor uses",
        body:
          "Needle running time in a day ≈ pieces made × stitching time per piece. That turns the log into an estimate of pieces per machine, showing idle time and uneven loading across a line. It sat alongside the WIP ranking and dashboard work.",
      },
    ],
    results: [
      { value: "25%", label: "output gain", how: "Reported by the floor team after the change. Tracking was one part of a wider intervention with dashboards and WIP work." },
      { value: "< ₹400", label: "per machine", how: "Component cost from the project report" },
    ],
    limits: [
      "Pedal time stands in for needle time; it doesn't count stitches or check quality.",
      "The 25% gain belongs to the whole operating change, not to the sensor alone.",
    ],
    shots: [s("iot-test", "Testing the tracker on a working sewing machine", "676 / 748")],
    sources: [{ label: "Project report with code and figures (16 pages)", url: drive("1H8QWQmG2oHzkgHFiMSYlpR1_NYcWy47e") }],
  },

  /* ------------------------------------------------------------------ */
  "ops-3": {
    glance: {
      role: "Manufacturing intern: plant-wide waste analysis and the proposal to remove mock selvage",
      when: "June 2022",
      where: "Welspun India, terry towel unit, Vapi",
      with: "Loom engineering mentor; later implementation and measurement by the floor team",
      tools: "Process mapping, waste costing, loom mechanics; NEDGraphics, DPCS and MDM in the development workflow",
    },
    situation: {
      lede:
        "Every department tracked its output closely, but waste was never compiled unit by unit or costed in rupees, so no one could see where the plant was actually losing material.",
      facts: [
        { value: "639,830 kg", label: "of waste compiled across five units" },
        { value: "79%", label: "of it from weaving (506,986 kg)" },
        { value: "168", label: "dobby looms in the unit" },
        { value: "≈ 2 kg", label: "mock-selvage hard waste per loom per day" },
      ],
    },
    steps: [
      {
        title: "Mapped where waste is created",
        body: "Walked spinning, yarn dyeing, weaving, processing and common areas with each section's in-charge and listed every waste point.",
      },
      {
        title: "Put a price on it",
        body:
          "Converted each unit's waste from kilograms into rupees. By both measures, weaving dominated: about 79% of the weight and 78% of the cost of all compiled waste.",
      },
      {
        title: "Found the waste no one could recycle",
        body:
          "Mock selvage is the sacrificial edge woven so the towel edge holds, then cut off. Its leno threads are polyester and the weft is cotton, often dyed, so the trimmings are a mixed-fibre waste that can't go back into yarn.",
      },
      {
        title: "Proposed a tuck-in edge",
        body:
          "A tuck-in device weaves the cut weft ends back into the fabric, so no mock selvage is needed. Welspun already used these on shirting looms at Anjar, but never on terry looms. I flagged the risks (edge thickness and density, loom running, towel hemming) and set out the investment and savings to test.",
      },
      {
        title: "Saw it through to measurement",
        body:
          "Loom engineers ran the trials. After implementation, the floor team measured the targeted waste stream before and after, with me observing and recording.",
      },
    ],
    results: [
      { value: "≈ 300 kg", label: "of hard waste removed a day", how: "The mock-selvage stream only, measured by the floor team before and after" },
      { value: "109,500 kg", label: "a year, annualised", how: "300 kg × 365 days; at 300 working days it would be 90,000 kg" },
      { value: "₹372.9M", label: "of waste costed across five units", how: "Sum of the unit-wise costs in the internship report; the report does not state the period" },
    ],
    limits: [
      "The reduction covers the mock-selvage stream, not all plant waste.",
      "Installation was done by the factory's engineers, not by me.",
    ],
    shots: [
      s("welspun-selvage", "Mock-selvage trimmings: mixed polyester and cotton, unrecyclable", "563 / 745"),
      s("welspun-floor", "Blow room in the spinning unit, one of the five units mapped", "1200 / 900"),
      s("welspun-godown", "Cotton godown, where the material flow starts", "1200 / 900"),
      s("welspun-spinning", "Combing and draw frames in the spinning unit", "1200 / 1600"),
    ],
    sources: [
      { label: "Internship report (86 pages)", url: drive("13PafLYhEn-VKUBVwZdt0lItAmQY5tA5K") },
      { label: "Presentation (15 slides)", url: drive("1xgA_lNMUeaRim0_djSCL3IEdb70Lnrjb") },
    ],
  },

  /* ------------------------------------------------------------------ */
  "inzex-dashboards": {
    glance: {
      role: "IE / data intern: built the sales and inventory dashboards",
      when: "June – July 2022",
      where: "INZEX Textiles, Myntra PPMP fulfilment",
      tools: "Excel, Google Sheets connector, Google Data Studio",
    },
    situation: {
      lede:
        "INZEX fulfilled Myntra orders for three brands, but sales and inventory lived in separate Excel exports. Answering \"what is selling, where, and how deep is our assortment\" meant rebuilding the same tables by hand each time.",
      facts: [
        { value: "3", label: "brands: Sangria, Kook N Keech, Minions by Kook N Keech" },
        { value: "3", label: "dashboard pages" },
        { value: "4", label: "filters: date, brand, SKU and city" },
      ],
    },
    steps: [
      { title: "Structured the raw exports", body: "Turned loose Excel sheets into named tables so they could be connected and refreshed instead of copied." },
      { title: "Connected them once", body: "Excel to Drive to the Google Sheets connector to Data Studio, with a scheduled refresh so the views stay current." },
      { title: "Page 1: sales and orders by brand", body: "Brand comparison, the top 10 products by sales, and SKU counts to show assortment depth." },
      { title: "Page 2: distribution and market", body: "Sales by city and brand, top towns, unique bill counts and a map view for regional demand." },
      { title: "Page 3: assortment depth", body: "Quantity sold, the top and bottom 10 articles, and category and sub-category mix, with a SKU filter for drill-down." },
    ],
    results: [
      { value: "1", label: "connected view in place of separate exports", how: "Self-refreshing dashboards; no business outcome is claimed for them on their own" },
      { value: "4", label: "decisions informed", how: "Allocation, replenishment, markdown and OTB/WSSI planning; the decisions were the team's" },
    ],
    limits: [
      "The dashboards support decisions; the budgets and plans were owned by others.",
      "The original report is behind a sign-in, so headline sales figures are not shown here.",
    ],
    sources: [{ label: "Dashboard presentation (18 slides)", url: drive("15TQBIFJWAZmWEVpdmxsUZ_AUCwMg6Su5") }],
  },

  /* ------------------------------------------------------------------ */
  "merch-1": {
    glance: {
      role: "Research, business model, product requirements and prototype",
      when: "2024 – 2025",
      where: "Parsons MPS Fashion Management capstone",
      tools: "Survey design, ANOVA, pricing and willingness-to-pay analysis, Figma, React/Next.js, Python/FastAPI, SQLite",
    },
    situation: {
      lede:
        "Independent streetwear and upcycling makers struggle to be found, and buyers struggle to trust them. Big marketplaces bury small labels and take the credit and the margin.",
      facts: [
        { value: "80", label: "buyers surveyed" },
        { value: "73%", label: "named discovery as their main barrier" },
        { value: "77%", label: "ranked material quality first" },
        { value: "58%", label: "willing to pay under $60" },
      ],
    },
    steps: [
      { title: "Asked buyers first", body: "A short anonymous survey on how people find and buy from independent labels, covering discovery, trust, price and returns." },
      { title: "Segmented and priced", body: "Willingness-to-pay segments and an ANOVA across buyer groups (F(3,76), p = .020) shaped who to serve first and at what price." },
      { title: "Chose a trust-first MVP", body: "Verified sellers, local returns and transparent fees, the three frictions buyers named, came ahead of everything else, along with artist profiles, tiered commissions and dynamic pricing." },
      { title: "Prototyped it", body: "Screens and a working prototype for vendor onboarding, discovery and purchase, with the operating model behind pricing and distribution." },
    ],
    results: [
      { value: "4.31 / 5", label: "rating for a verified-seller badge", how: "Survey response; preference, not behaviour" },
      { value: "Featured", label: "on the Parsons student work site", how: "Institutional publication; capstone showcase at the Parsons FM Festival" },
      { value: "18%", label: "seller-conversion lift (modelled)", how: "A scenario estimate, not an observed result; Nava is a prototype, not a live marketplace" },
    ],
    sources: [{ label: "Parsons project profile", url: "https://www.newschool.edu/parsons/profile/shreyash-ojha/" }],
  },

  /* ------------------------------------------------------------------ */
  "merch-2": {
    glance: {
      role: "Seasonal sales associate, Men's Designer & Sportswear",
      when: "October 2025 – January 2026",
      where: "Bloomingdale's, 59th Street, New York",
      tools: "Needs discovery, fit and size resolution, cross-category selling, clienteling notes",
    },
    situation: {
      lede:
        "Peak season on a flagship floor: designer customers comparing fit, price, occasion and what is actually in stock, often across brands in a single visit.",
      facts: [
        { value: "12+", label: "designer brands on the floor" },
        { value: "$3K–3.5K", label: "average daily sales" },
        { value: "$7K–8K", label: "on peak days" },
      ],
    },
    steps: [
      { title: "Found the real need", body: "Asked about occasion, fit history and price before showing product, then compared options across brands rather than within one." },
      { title: "Solved fit on the spot", body: "Substituted sizes and cuts when stock ran out, and explained differences in fabric and fit between labels." },
      { title: "Kept the customer", body: "Logged availability, fit and colour preferences and promotion response, and followed up when the right piece arrived." },
    ],
    results: [
      { value: "6–7", label: "repeat clients built", how: "Personal clienteling book over the season" },
      { value: "$7K–8K", label: "peak-day sales", how: "Personal sales figures as reported on the résumé" },
    ],
    shots: [s("bloomingdales-feedback", "A customer's written feedback to the store", "1280 / 591")],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "brand-1": {
    glance: {
      role: "Head of Marketing and Event Operations; produced the reel soundtrack and designed the event website",
      when: "B.F.Tech second year (the artwork is dated 2022)",
      where: "Genesis 2.2, NIFT Delhi's freshers' event, run each year by the second-year cohort",
      tools: "Instagram reels and posts, word-of-mouth seeding, ticketing website (Figma, HTML/CSS/JS), music production",
    },
    situation: {
      lede:
        "A student event selling tickets to a close-knit audience of 18 to 22 year olds who choose events by how excited they feel, with a real worry about safety at night events.",
      facts: [
        { value: "6", label: "content waves, one per stage of the journey" },
        { value: "2 weeks", label: "before the event: the date reveal" },
      ],
    },
    steps: [
      { title: "Seeded it by word of mouth", body: "Picked trusted people from each department and batch to spread rumours of an event, then posted a mystery reel." },
      { title: "Built consideration", body: "The third wave explained what the night would feel like. It was the biggest jump in views, set to a beat I produced from scratch." },
      { title: "Held the date back", body: "Revealed the date only two weeks out, then launched passes on our own website with a payment gateway." },
      { title: "Answered the safety question", body: "Partnered with a local security agency; every pass was signed by the team and verified at the door." },
      { title: "Closed the loop", body: "Posted when stock ran low, then a highlights reel shot by independent videographers after the event." },
    ],
    results: [
      { value: "≈ 30 s", label: "to sell out the early-bird passes", how: "Firsthand account; the early-bird quota size isn't recorded" },
      { value: "150+", label: "attendees", how: "As reported" },
    ],
    shots: [
      s("genesis-posts", "Launch-phase posts", "1672 / 746"),
      s("genesis-reveal", "Date-reveal series", "1670 / 746"),
      s("genesis-passes", "Pass collection call", "1080 / 1080"),
      s("genesis-street", "Posters seeded around campus", "2117 / 2823"),
    ],
    sources: [{ label: "Recap deck (17 slides)", url: drive("1bpRSvDW00SDUsLKmv6uJjo7WDp0UYo27") }],
  },

  /* ------------------------------------------------------------------ */
  "brand-3": {
    glance: {
      role: "Sole analyst",
      when: "NIFT Delhi, Master of Fashion Management interdisciplinary coursework",
      where: "Myntra vs. Urbanic, desktop experience",
      tools: "Heuristic evaluation across ten UX laws, structured scoring",
    },
    situation: {
      lede:
        "What does a stronger fashion e-commerce experience do differently? Two Indian platforms, one established and one mobile-first, judged against the same principles.",
      facts: [
        { value: "10", label: "UX laws applied" },
        { value: "2", label: "platforms" },
        { value: "4.44 vs 3.96", label: "overall score, Myntra vs. Urbanic" },
      ],
    },
    steps: [
      { title: "Set the lens", body: "Ten principles, from Fitts's and Hick's laws to the Doherty threshold and common region, each assessed on both sites." },
      { title: "Wrote the evidence first", body: "Recorded strengths and failures for each law before any scoring." },
      { title: "Scored it", body: "Converted the written findings into a 1 to 5 score per law so the gaps are comparable at a glance." },
      { title: "Turned gaps into fixes", body: "Myntra: audit promotional density so offers don't compete with discovery. Urbanic: desktop layout rules, normalised image sizes and grouped filters." },
    ],
    results: [
      { value: "1.1", label: "points: the widest gap, on the aesthetic-usability effect", how: "4.7 vs. 3.6, derived from the qualitative review" },
      { value: "10 / 10", label: "laws led by Myntra", how: "Urbanic comes closest on common region (4.2 vs. 4.3)" },
    ],
    scores: {
      title: "Score by heuristic",
      a: "Myntra",
      b: "Urbanic",
      rows: [
        ["Aesthetic-usability", 4.7, 3.6],
        ["Fitts's law", 4.4, 4.0],
        ["Hick's law", 4.5, 3.8],
        ["Jakob's law", 4.5, 4.1],
        ["Serial position", 4.2, 4.0],
        ["Von Restorff", 4.3, 4.1],
        ["Zeigarnik", 4.6, 3.9],
        ["Proximity", 4.4, 4.0],
        ["Doherty threshold", 4.5, 3.9],
        ["Common region", 4.3, 4.2],
      ],
      note: "Scores (1–5) are derived from written qualitative findings, not from analytics or user testing.",
    },
    sources: [{ label: "Analysis report (8 pages)", url: drive("1_8vGaya523hiNWITaCBW5B0OP-F5cfhP") }],
  },

  /* ------------------------------------------------------------------ */
  "offwhite-human": {
    glance: {
      role: "Concept, social strategy and media plan (final project)",
      when: "Parsons MPS, Communication & Social Media",
      where: "Speculative brief for Off-White; not commissioned by the brand",
      tools: "Campaign concept, cross-platform content plan, paid / earned / shared / owned media mix, KPI design",
    },
    situation: {
      lede:
        "Virgil Abloh used construction marks (tape, chalk, cut lines) to say fashion is unfinished. The brief: bring that voice back to the street as something useful, not just another drop.",
      facts: [
        { value: "3", label: "stages: city, objects, people" },
        { value: "3 × 4", label: "posts a week for four weeks" },
        { value: "3", label: "launch cities: New York, LA, Houston" },
      ],
    },
    steps: [
      { title: "Found the brand's own language", body: "IN PROCESS → HUMAN re-uses the drafting marks rather than the familiar yellow strap. Cities are redrawn, objects relabelled (SEAT, SHELTER, ASCENT), and people tagged simply HUMAN." },
      { title: "Planned the content in rings", body: "City-grid drone clips, then object reels with an AR tape filter, then a pass-the-tape portrait chain that hands the campaign to the audience." },
      { title: "Added a physical stunt", body: "Seven days of social silence, then three pieces of public furniture appear, each with an LED slogan and an NFC tag linking to a small capsule, Utility-01." },
      { title: "Designed the media mix", body: "Pay for speed (24-hour geo-targeted ads), let earned and shared media carry it after launch, and convert on an owned microsite." },
      { title: "Set measurable targets", body: "Awareness by CPM, engagement by remix rate, action by NFC scan-to-cart, advocacy by earned media value checked for sentiment." },
    ],
    results: [
      { value: "≤ $6", label: "CPM target", how: "Against a fashion median of $8.62 (Varos, April 2025); a plan target, not a result" },
      { value: "≥ 8%", label: "NFC scan-to-cart target", how: "First 48 hours per city, against a ~5% e-commerce benchmark" },
      { value: "Endorsed", label: "by the course instructor", how: "Christina Lee cites this project in her recommendation letter" },
    ],
    shots: [
      s("ow-installs", "Installation mock-ups: SEAT and SHELTER with NFC tags", "1800 / 1013"),
      s("ow-safe", "Brand-revision intent: \"You're safe\"", "1800 / 1013"),
      s("ow-kpis", "KPI targets", "1800 / 1013"),
    ],
    sources: [{ label: "Concept, proposal and media plan (folder)", url: "https://drive.google.com/drive/folders/1FyCvnSjlEt29aOEAv7ySClw-y66rjbSL" }],
  },
};
