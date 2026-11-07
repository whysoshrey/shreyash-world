/**
 * Project dossiers: the operational detail behind each case study, drawn from the project's own documents
 * (reports, decks and dissertation on Drive) and the latest résumé.
 *
 * Evidence rules, carried over from the career-profile assessment:
 *  - "What changed" figures say how they were obtained. Factory results after the original reports (ops-1, ops-2) were
 *    measured by the on-floor team; the source records are not public. Welspun (ops-3) is a proposal: its 300 kg/day is a
 *    sized potential, per the internship report and the October 2026 CV.
 *  - Targets, modelled figures and derived scores are labelled as such, never presented as outcomes.
 *  - Nothing here is invented to fill a gap: where a document doesn't say, the dossier doesn't either.
 */

export type Fact = { value: string; label: string };
export type Step = { title: string; body: string };
export type Result = { value: string; label: string; how: string };
export type Shot = { src: string; caption: string; ratio: string };
export type Source = { label: string; url: string };

export type Dossier = {
  /** SM-01: how far the evidence goes, in plain words (measured, reported, modelled, coursework, concept) */
  status: string;
  /** who / what / where / when / why: every project answers all five */
  glance: { what: string; role: string; when: string; where: string; with?: string; why: string; tools: string };
  situation: { lede: string; facts: Fact[] };
  steps: Step[];
  results: Result[];
  /** optional scored comparison (UX benchmark) */
  scores?: { title: string; a: string; b: string; rows: [string, number, number][]; note: string };
  limits?: string[];
  video?: { src: string; poster: string; caption: string };
  shots?: Shot[];
  /** interactive 3D model section (ACME robot only) */
  model3d?: boolean;
  /** design specification table, with how each number was arrived at */
  specs?: { rows: { label: string; value: string; note?: string }[]; note?: string };
  sources: Source[];
};

const s = (file: string, caption: string, ratio: string): Shot => ({ src: `/assets/web/${file}.webp`, caption, ratio });
const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const DOSSIERS: Record<string, Dossier> = {
  /* ------------------------------------------------------------------ */
  "ops-1": {
    status: "Factory pilot · results measured by the floor team",
    glance: {
      what: "An autonomous robot that carries cut bundles from the cutting room to the sewing lines, plus the route study behind it.",
      role: "Technical lead on a two-person dissertation: all wiring, IoT design, RFID routing logic and technical deployment",
      when: "January – July 2024",
      where: "Shahi Exports, Industry 4.0 Research Fellowship (Shahi Chair, NIFT Delhi)",
      why: "One shared lift fed 16 lines; when it was busy, helpers left their machines to carry 60 kg loads, stalling output.",
      with: "Dissertation co-authored with Charuvi Ranjan, guided by Dr. Deepak Panghal; post-pilot measurement by the factory floor team",
      tools: "Python, Arduino C++ (PlatformIO), Arduino Mega, ESP32 web interface, PN532 RFID reader, line sensor, ultrasonic sensor on a servo, HTML/JS",
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
          "Researched LiDAR/visual SLAM and magnetic guide tape, and rejected both: SLAM needs far more computing power and money than a fixed floor layout justifies, and tape is costly to lay and change. Settled on a painted line for path-keeping plus RFID tags at loading, unloading and junction points; at each tag a lookup table tells the robot to go straight, turn left, turn right or stop. A graph-based shortest-path planner (Dijkstra) was left for a later version.",
      },
      {
        title: "Built the robot",
        body:
          "Sized the drive from first principles (friction and mass gave 2.5 Nm stall torque per motor) and the battery from the power budget. Four 12 V geared motors on omni wheels carry a 20 kg payload deck over laser-cut aluminium and steel plates. An Arduino Mega runs line following and routing, and an ESP32 hosts a web page from which one operator calls the robot to a station. An ultrasonic sensor sweeps on a servo for obstacles, with a kill switch and an LCD for status. Control code was written in Python and in C++ with PlatformIO.",
      },
      {
        title: "Broke it, diagnosed it, fixed it",
        body:
          "Eight motors failed in testing: misaligned gearboxes put sideways load on the shafts, and the first fix (metal clamps) warped the shaft and burned the coils. The answer was a central support caster that takes weight off the motor shafts. The RFID reader also had to move away from the aluminium plates, which were detuning its signal.",
      },
      {
        title: "Piloted it and made the business case",
        body:
          "After the dissertation, the robot moved into a floor pilot. The floor team measured it while I observed and recorded. I mapped 14 workflows and analysed 15,000+ movement events, built a 12-month ROI case, and presented the trade-offs to senior management, production and engineering. The Ministry of Textiles then selected the robot for the Bharat Tex 2025 showcase.",
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
      s("agv-exploded", "Exploded view from the 3D model: drive, plates, electronics, deck and casing", "750 / 720"),
    ],
    sources: [
      { label: "ACME dissertation, NIFT Delhi, May 2024 (99 pages)", url: drive("1cWLt55gFnziJ50tH_0GH9FJ-ZZaMy0_Q") },
      { label: "Presentation at Bharat Tex", url: drive("1QU_vI47lLPdXV8sfeGPbfxwZ-jTlaZ04") },
    ],
    model3d: true,
    specs: {
      rows: [
        { label: "Payload", value: "20 kg", note: "Design requirement; a full crate is 40 kg" },
        { label: "Robot mass", value: "≈ 5 kg", note: "Estimate used for the torque sums" },
        { label: "Torque per motor", value: "2.5 Nm stall", note: "1.875 Nm rated; from μ = 0.7 / 0.5 and 5 cm wheels" },
        { label: "Supply", value: "12 V", note: "One voltage for motors and battery" },
        { label: "Power budget", value: "≈ 20 W", note: "4 × 12 V × 0.3 A = 14.4 W, plus a buffer" },
        { label: "Battery", value: "5 Ah", note: "Sized for 2–3 hours on a charge" },
        { label: "Speed with load", value: "≈ 0.2 m/s", note: "40 RPM; the 1 m/s design target was traded for stability" },
        { label: "Build cost", value: "₹15,000", note: "Estimate, plus about ₹5,000 a year upkeep" },
        { label: "Plates", value: "4 mm aluminium · 1 mm steel", note: "CNC laser-cut from AutoCAD drawings" },
      ],
      note: "Design figures and estimates from the dissertation (May 2024), not pilot measurements. The prototype’s 61 m average round trip takes about 305 s at 0.2 m/s; loading time and payback could not be measured on the prototype.",
    },
  },

  /* ------------------------------------------------------------------ */
  "ops-2": {
    status: "Internship build · output gain reported by the floor team",
    glance: {
      what: "A sub-₹400 sensor on each sewing machine that logs needle running time to a cloud sheet automatically.",
      role: "Designed and built the tracker: sensing, firmware, cloud logging and the reading of the data",
      when: "June – July 2023 (internship); written up in May 2024",
      where: "INZEX Textiles, sewing floor",
      why: "Supervisors judged efficiency by walking the line; industrial monitors cost too much to fit every machine.",
      with: "Internship report co-authored with Kanishk Singh",
      tools: "Python, NodeMCU ESP8266, HC-SR04 ultrasonic sensor, Arduino IDE, Google Apps Script, Google Sheets",
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
    status: "Internship analysis · proposal; the 300 kg/day is a potential, not a measured result",
    glance: {
      what: "A plant-wide waste audit across five units and a loom-level proposal to remove mock selvage.",
      role: "Manufacturing intern: plant-wide waste analysis and the proposal to remove mock selvage",
      when: "June 2022",
      where: "Welspun India, terry towel unit, Vapi",
      why: "Waste was never costed unit by unit, so the plant could not see where it was losing the most material.",
      with: "Loom engineering mentor",
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
        title: "Sized the potential",
        body:
          "Each dobby loom produced about 2 kg of mock-selvage hard waste a day. Across the unit's 168 looms, that is the roughly 300 kg a day the proposal would remove.",
      },
    ],
    results: [
      { value: "≈ 300 kg", label: "a day of hard waste the proposal targets", how: "Reduction potential: ≈2 kg per loom × 168 looms, from the internship report; not a measured result" },
      { value: "109,500 kg", label: "a year, if implemented", how: "300 kg × 365 days; at 300 working days it would be 90,000 kg" },
      { value: "₹372.9M", label: "of waste costed across five units", how: "Sum of the unit-wise costs in the internship report; the report does not state the period" },
    ],
    limits: [
      "This was a proposal: the figures are a sized potential, and no implemented result is claimed.",
      "The potential covers the mock-selvage stream only, not all plant waste.",
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
    status: "Internship build · no business outcome claimed",
    glance: {
      what: "Connected sales and inventory dashboards for three Myntra brands, filterable by date, brand, SKU and city.",
      role: "IE / data intern: built the sales and inventory dashboards",
      when: "June – July 2023",
      where: "INZEX Textiles, Myntra PPMP fulfilment",
      why: "Sales and stock sat in separate exports, so every allocation or replenishment question meant rebuilding tables by hand.",
      with: "Internship report co-authored with Kanishk Singh",
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
  "inzex-line-layout": {
    status: "Internship proposal · the flow index is calculated on the redesigned layout; no measurement after a change is reported",
    glance: {
      what: "A re-sequenced 21-operation denim line, scored with a WIP movement point system.",
      role: "Line analysis and layout redesign (internship project)",
      when: "June – July 2023",
      where: "INZEX Textiles, denim sewing line (5-pocket jeans)",
      why: "Uneven operation times left some operators idle and others queued, with bundles crossing back and forth between tables.",
      with: "Internship report co-authored with Kanishk Singh",
      tools: "Precedence diagram, heuristic line balancing, WIP movement point scoring",
    },
    situation: {
      lede:
        "Operation times on the denim line varied widely: some operators sat idle while others queued work, and bundles travelled back and forth across several tables. The floor could hold at most 49 workstations, so the fix had to come from the arrangement, not from more machines.",
      facts: [
        { value: "21", label: "operations, from bundle to button-hole" },
        { value: "49", label: "workstations the floor can hold" },
        { value: "20", label: "WIP moves mapped between operations" },
        { value: "1 of 20", label: "moves went to an adjacent machine" },
      ],
    },
    steps: [
      {
        title: "Mapped the current flow",
        body: "Drew the precedence of all 21 operations and, from production data, plotted every move of work-in-progress between machines on the floor plan: 12 straight moves across tables, 7 diagonal and 1 adjacent.",
      },
      {
        title: "Scored every move",
        body: "Gave each move a point score by distance and direction: 4 points to the adjacent machine, 2 for each table crossed in front, and diagonal moves scored as the hypotenuse of the two. The existing layout came to 104.5 points.",
      },
      {
        title: "Turned it into an index",
        body: "Material-flow index = (2 × machines) ÷ total points. With 20 machines, the existing layout scored 40 ÷ 104.5 = 38.2%.",
      },
      {
        title: "Re-sequenced the line",
        body: "Rearranged operations so that work passes to the nearest machine in sequence, then scored the proposed layout with the same rules: 83 points.",
      },
    ],
    results: [
      { value: "104.5 → 83", label: "WIP movement points", how: "Same scoring rules, existing vs. proposed layout" },
      { value: "38.2% → 48.2%", label: "material-flow index", how: "(2 × 20 machines) ÷ points: about 10 points better on the drawing" },
    ],
    limits: [
      "Both scores are calculated from layout drawings; the report does not include a measurement after the line was rearranged.",
      "The point weights (4 for an adjacent move, 2 per table crossed) are the project's own convention, not an industry standard.",
    ],
    shots: [
      s("inzex-layout-before", "Before: 20 moves, most jumping across tables (104.5 points)", "1600 / 800"),
      s("inzex-layout-after", "After: the re-sequenced layout (83 points)", "1600 / 800"),
    ],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "inzex-ismart": {
    status: "Internship study · no implementation results reported",
    glance: {
      what: "A study of eight operator-rating methods and NIFT's sensor-based i-SMART skill rating, with recommendations.",
      role: "Research and recommendations (internship project)",
      when: "June – July 2023",
      where: "INZEX Textiles, sewing floor; a study of NIFT Delhi's i-SMART system",
      why: "Rating sewing skill by eye is subjective; an objective score drives fairer pay, training and line balancing.",
      with: "Internship report co-authored with Kanishk Singh. i-SMART was developed at NIFT Delhi by Dr. Deepak Panghal and Dr. Prabir Jana",
      tools: "Operator rating methods, ABC skill matrix, i-SMART (rotary-encoder sensing, template stitching, cloud scoring)",
    },
    situation: {
      lede:
        "Operator rating is one of the most contested parts of industrial engineering. Most floors judge sewing skill by output quality and completion time, which leaves out speed, handling time and needle running time, and depends on who is watching.",
      facts: [
        { value: "8", label: "traditional rating methods compared" },
        { value: "3", label: "skill bands in the ABC matrix" },
        { value: "5", label: "fabric templates stitched per i-SMART test" },
        { value: "2", label: "scores per operator: process and quality" },
      ],
    },
    steps: [
      {
        title: "Compared rating methods",
        body: "Laid out eight traditional rating systems, from speed rating to Portnoff, with what each considers, its advantages and where it falls short.",
      },
      {
        title: "Set out the skill bands",
        body: "Described the ABC skill matrix: multi-skilled A operators, single-operation B operators who can move up, and C operators who work one machine and need continuing training.",
      },
      {
        title: "Studied how i-SMART works",
        body: "A magnetic rotary encoder on the machine's main shaft records speed while the operator stitches five fabric templates; the scanned templates and process data produce a process rating and a quality rating.",
      },
      {
        title: "Recommended improvements",
        body: "Wider data sources, refined scoring models, measures of soft skills, structured user feedback, and links to HR performance and learning systems.",
      },
    ],
    results: [
      { value: "5", label: "recommendations for i-SMART", how: "Proposed in the report; not tested" },
    ],
    limits: [
      "A desk study of an existing NIFT Delhi system: the report does not record i-SMART being installed or tested at INZEX.",
    ],
    shots: [
      s("inzex-ismart-methods", "From the report: eight traditional rating methods compared", "797 / 1009"),
      s("inzex-ismart-system", "From the report: i-SMART hardware and how it works", "756 / 953"),
    ],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "mango-intervention": {
    status: "Coursework · strategy proposal built on store visits and interviews",
    glance: {
      what: "A store-to-systems intervention plan for Mango covering operations, circularity and social responsibility.",
      role: "Sole author: store visits, floor-team interviews, research and the intervention plan",
      when: "September – October 2024",
      where: "Parsons MPS Fashion Management, Company Intervention report",
      why: "Mango is scaling fast against Zara and H&M, but its stores ran on manual billing and its sustainability work was invisible to shoppers.",
      tools: "Store observation, interviews, competitor and financial research, supply-chain and circularity frameworks",
    },
    situation: {
      lede:
        "Mango closed 2023 with record sales of €3.1 billion and 130+ new stores, competing head-on with Zara and H&M. On its New York floors, though, billing was manual, stock was tracked by piece reference, and its recycling and loyalty programmes were invisible to shoppers.",
      facts: [
        { value: "€3.1 bn", label: "2023 sales, up 15%" },
        { value: "2,700+", label: "stores in 110+ countries" },
        { value: "50%", label: "of products made in Asia, routed through a central hub" },
        { value: "3", label: "issue areas: sustainability, operations, social justice" },
      ],
    },
    steps: [
      { title: "Went to the floor", body: "Walked Mango's New York stores, including SoHo, and interviewed the floor management team on billing, stock control, layout changes and how the store picks product." },
      { title: "Diagnosed the operation", body: "Found a reference-based, 'very old school' stock system, walls of 'ambiances' reworked by hand once or twice a week, men's and kids' pushed to the back with little traffic, and manual one-by-one billing." },
      { title: "Checked the sustainability story", body: "Mango's I:CO take-back and Committed Box rewards existed, but nothing in store told customers; material mix still leaned on polyester and conventional cotton." },
      { title: "Proposed the future scenario", body: "RFID tagging with basket-scan self-checkout (as Decathlon India already runs), AI-led allocation of leftover stock across stores, camera heat-mapping for layout, cross-docking instead of the central hub, a 2030 recycled-materials commitment, blockchain traceability, in-store repair ('Mango Renewed') and an ADA accessibility audit." },
    ],
    results: [
      { value: "8", label: "operational interventions", how: "Proposed in the report; coursework, not implemented" },
      { value: "8", label: "sustainability interventions", how: "From take-back and repair to a 2030 materials target" },
      { value: "3", label: "social-responsibility measures", how: "Worker feedback line, compensation fund, accessibility audit" },
    ],
    limits: ["A course report: the interventions are proposals, not tested with Mango."],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "doen-impact": {
    status: "Coursework · team strategy for a real brand, built on its public catalogue",
    glance: {
      what: "An environmental and social impact strategy for DÔEN: fibre audit, material swaps, vendor compliance and end of life.",
      role: "Team member on material analysis, strategy and research (Team BRAVO, four people)",
      when: "February – May 2025",
      where: "Parsons PMFM 5050 Manufacturing & Production",
      why: "DÔEN has public 2030 targets, yet conventional cotton, polyester and rayon still sit in its mix.",
      with: "Ada Creighton, Khushi Agrawal and Neha Lizbeth Peter; Prof. Bjorn Bengtsson",
      tools: "Catalogue fibre audit (spreadsheet), material impact data (Textile Exchange, Higg), vendor survey, circularity frameworks",
    },
    situation: {
      lede:
        "DÔEN is a women-run, direct-to-consumer label with seven US boutiques and a public 2030 roadmap tied to eight UN SDGs. Its collections favour natural fibres, yet conventional cotton, polyester and rayon still sit in the mix.",
      facts: [
        { value: "25.4%", label: "organic cotton, the largest fibre" },
        { value: "14.8%", label: "conventional cotton" },
        { value: "5.3%", label: "polyester blends" },
        { value: "61%", label: "of the range in the top five fabrics" },
      ],
    },
    steps: [
      { title: "Audited the fibre mix", body: "Classified DÔEN's catalogue by category and fabric to get the share of each fibre, from organic cotton and silk to alpaca and goat suede." },
      { title: "Matched swaps to the aesthetic", body: "Short term: BCI in place of conventional cotton, GRS recycled polyester for linings and trims, TENCEL lyocell for rayon. Medium and long term: regenerative cotton and next-generation fibres, judged on cost, hand-feel and supply." },
      { title: "Surveyed the vendors", body: "Reviewed social compliance, audits and living-wage disclosure, and recommended third-party audits, a published Supplier Code of Conduct and better traceability." },
      { title: "Closed the loop", body: "Built on the Hand Me DÔEN resale programme with repair, upcycling and rental, plus in-store mending workshops." },
    ],
    results: [
      { value: "3", label: "phased material horizons", how: "Short, medium and long term, in the final paper" },
      { value: "45–65%", label: "lower emissions on recycled polyester swaps", how: "Textile Exchange figure cited in the paper, not measured" },
    ],
    limits: ["A course project from public data; DÔEN did not commission or adopt it."],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "nir-sorting": {
    status: "Research methods study · ANOVA on published spectral data",
    glance: {
      what: "A statistical test of whether NIR spectroscopy can sort blended fabrics into their own recycling stream.",
      role: "Co-researcher: framing, statistics and analysis",
      when: "December 2023",
      where: "NIFT Delhi, Research Methodology jury",
      why: "Sorting lines reject blends they cannot recognise, so a large share of textile waste never gets recycled.",
      with: "Afan Thabreez K P and Charuvi Ranjan",
      tools: "One-way ANOVA, NIR spectroscopy (EVK Helios EQ32, 930–1700 nm), literature review",
    },
    situation: {
      lede:
        "Automated NIR lines sort textile waste by fibre so it can be recycled. Anything the sensor cannot match to a pure fibre, such as blends, finished, thin or aged fabric, is rejected and leaves the loop entirely.",
      facts: [
        { value: "72", label: "specimens" },
        { value: "18", label: "readings per specimen" },
        { value: "4", label: "fabric types: cotton, polyester, polycotton, polycotton-elastane" },
        { value: "1300–1400 nm", label: "band analysed" },
      ],
    },
    steps: [
      { title: "Framed the question", body: "Do blends emit spectra different enough from pure fibres to be sorted into their own category instead of rejected?" },
      { title: "Took the data", body: "Sampled peak values from published first-derivative spectra (Becker et al.) across four fabric types." },
      { title: "Ran the test", body: "One-way ANOVA: between-sample sum of squares 13,158, within 5,158, F = 61.23 against a critical 2.73 at 0.05." },
      { title: "Read the peaks", body: "Cotton peaks near 1384 nm, polyester 1352, polycotton 1350 and polycotton-elastane 1360; elastane appears to shift the peak." },
    ],
    results: [
      { value: "61.23", label: "F statistic vs 2.73 critical", how: "Null hypothesis of equal means rejected at 0.05" },
      { value: "95%", label: "separable across the four types", how: "Estimate from overlap in the readings" },
    ],
    limits: ["Built on secondary data; confirming it needs an NIR rig the team did not have."],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "solid-waste-review": {
    status: "Coursework · literature and case review",
    glance: {
      what: "A map of where a garment unit creates solid waste, and a review of the systems that reduce it.",
      role: "Sole author",
      when: "September 2023",
      where: "NIFT Delhi, Designing a Manufacturing Setup (Sustainability)",
      why: "Waste builds up at every production step, and most fixes stop at biodegradability instead of closing the loop.",
      with: "Under Dr. Prabir Jana",
      tools: "Process waste mapping, waste hierarchy, zero-waste and 3R frameworks, case research",
    },
    situation: {
      lede:
        "A garment unit makes solid waste at every step: damaged stock in the fabric store, offcuts in cutting, rejects in bundling and on the line, and sludge from wet and chemical processing.",
      facts: [
        { value: "6", label: "waste sources mapped in a production setup" },
        { value: "3", label: "management frameworks compared" },
        { value: "6", label: "industry cases benchmarked" },
      ],
    },
    steps: [
      { title: "Mapped the sources", body: "Fabric store, cutting room, bundling room, production floor, aqueous systems and chemical systems." },
      { title: "Compared the frameworks", body: "Waste management hierarchy, zero-waste closed loops and the 3R hierarchy, with the argument that the industry needs incentivised closed-loop systems, not biodegradability alone." },
      { title: "Benchmarked practice", body: "Patagonia (Worn Wear, Common Threads), Brazil's fabric banks, Evrnu's regenerated cotton, Saitex's Rekut, Stelapop and Atelier & Repairs, and solar sludge drying." },
    ],
    results: [{ value: "1", label: "closed-loop case for garment units", how: "Coursework recommendation; it set up the later Welspun waste costing" }],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "wfx-plm": {
    status: "Coursework · software evaluation",
    glance: {
      what: "A lifecycle map of WFX PLM with real deployments, and a 43-point feature audit of the ZenTao planning tool.",
      role: "Co-author of the PLM study; author of the ZenTao audit",
      when: "April – October 2023",
      where: "NIFT Delhi, Apparel Merchandising and project management coursework",
      why: "Merchandisers run on PLM and planning software; choosing the right one, and knowing its gaps, protects T&A calendars and margins.",
      with: "PLM study with Arvantika Dhawan and Yahowanissi Tirkey; Prof. Archana Gandhi",
      tools: "WFX Cloud PLM, ZenTao, PERT/CPM, critical path and resource planning",
    },
    situation: {
      lede:
        "Merchandisers live inside PLM and planning software, from tech pack and BOM to sampling, T&A calendars and reorders. Picking the right system, and knowing its gaps, is part of the job.",
      facts: [
        { value: "6", label: "lifecycle stages mapped in WFX" },
        { value: "600+", label: "brands on WFX, including Skims and Everlane" },
        { value: "43", label: "planning features audited in ZenTao" },
        { value: "11", label: "ZenTao gaps found" },
      ],
    },
    steps: [
      { title: "Mapped PLM to the lifecycle", body: "Design, development, manufacturing, distribution, maintenance and retirement, with WFX features for each: tech packs, material libraries, sampling, BOM, QC checkpoints, inventory and shipping." },
      { title: "Read real deployments", body: "Benetton India's SAP integration and vendor portal, Gokaldas Exports linking 530 vendors with BOMs and POs within 24 hours, Triburg's $200 million sourcing network, Villa's online approvals." },
      { title: "Audited a planning tool", body: "Checked ZenTao against a 43-point checklist: Gantt, PERT and network charts, critical path, float, resources, costs, calendars and constraints." },
    ],
    results: [
      { value: "11", label: "gaps found in ZenTao", how: "No CPM chart, critical chain, resource levelling or PERT time estimate, among others" },
    ],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "auto-packing": {
    status: "Coursework · design, not built",
    glance: {
      what: "A two-conveyor station that counts 20 pieces into a box, ejects it and seals it, specified down to sensors and code.",
      role: "Co-designer: system logic, sensors and control parameters",
      when: "Spring 2023",
      where: "NIFT Delhi, Mechatronics",
      why: "End-of-line packing in apparel is still counted and sealed by hand: slow, tiring and error-prone.",
      with: "Arvantika Dhawan and Charuvi Ranjan",
      tools: "Arduino Uno, HC-SR04 ultrasonic and IR sensors, proximity sensor, stepper and servo motors, pneumatics, I2C",
    },
    situation: {
      lede:
        "End-of-line packing in apparel is still counted and sealed by hand. The brief: a system that counts garments into a box, swaps the box when full and seals it.",
      facts: [
        { value: "20", label: "pieces per box" },
        { value: "2", label: "conveyors running in opposite directions" },
        { value: "20 s", label: "dwell while the box fills" },
      ],
    },
    steps: [
      { title: "Designed the flow", body: "Items fall from the top conveyor into a box held on the lower one; a proximity sensor stops the box in position and an ultrasonic sensor counts each drop." },
      { title: "Wrote the control logic", body: "At 20 pieces the Arduino stops the feed, runs the box conveyor to the pneumatic ejector and sealing station, and resets the count." },
      { title: "Specified the hardware", body: "Servo and stepper drives, pneumatic cylinders and rotary actuators, pressure sensing for the seal, and an I2C bus with optional load cell and label printer." },
    ],
    results: [{ value: "1", label: "complete mechatronic design", how: "Schematic, parameters and control logic; not prototyped" }],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "tory-burch-digital": {
    status: "Coursework · strategy and product concepts built on research and a store-manager interview",
    glance: {
      what: "A technology assessment and intervention strategy for Tory Burch (AI clienteling, blockchain traceability, RFID inventory) plus three wearable-tech product concepts.",
      role: "Co-author and co-presenter: brand and market research, current-technology assessment, strategy proposals and virtual-fashion concepts",
      with: "Kami Wang and Walker Perry; Prof. Dyese Matthews",
      where: "Parsons MPS Fashion Management, PMFM 5030 Technology & Intervention; research included an interview with the SoHo flagship's store manager",
      when: "September – December 2024 (mid-term audit in October, final report and presentation in December)",
      why: "Tory Burch is a $1.5 bn brand mid-rebrand, yet store teams said its tools (Tête, SAP, Microsoft Suite) cost selling time, mismatch stock across channels and give customers no traceability.",
      tools: "SWOT and competitor mapping, customer-journey and supply-chain review, stakeholder interview, AI / blockchain / RFID solution design, concept renders (Midjourney)",
    },
    situation: {
      lede:
        "Tory Burch sells handbags, ready-to-wear, footwear and accessories to 25–45 year-old professional women, positioned as accessible luxury against Michael Kors, Coach and Kate Spade. Its 'Toryssaince' rebrand was winning younger shoppers, but in store the clienteling app took associates off the floor, SAP stock counts did not match between online and stores, and a customer could not see where a product came from.",
      facts: [
        { value: "$1.5 bn", label: "estimated annual revenue" },
        { value: "100+", label: "stores across four regions" },
        { value: "20–30%", label: "of revenue from e-commerce" },
        { value: "3", label: "core systems assessed: Tête, SAP, Microsoft Suite" },
      ],
    },
    steps: [
      { title: "Mapped the brand and the market", body: "Mission and values (the 'Empowering Women' platform, Foundation, HERproject, responsible-cotton targets), target customer, accessible-luxury positioning against Michael Kors, Coach and Kate Spade, and a full SWOT." },
      { title: "Audited the technology, with the people who use it", body: "Reviewed the customer journey and supply chain, then interviewed the SoHo flagship's store manager: Tête helps clienteling but eats selling time and is not always accurate; SAP mismatches inventory across channels and offers no traceability; store-to-store and store-to-corporate messaging is unreliable." },
      { title: "Benchmarked against the leaders", body: "Gucci's virtual try-on, digital showroom and private online appointments (over 55% of its sales from under-35s), live-stream selling for Chinese shoppers, and the research on AI and blockchain for supply-chain provenance." },
      { title: "Designed three interventions", body: "1) AI inside Tête: personalised recommendations, automatic client-to-associate assignment, automated responses and ticketing, AI styling and AR/VR try-on. 2) Blockchain traceability with a 'Track Product Journey' scan in the app. 3) RFID tags with AI regional demand analysis for real-time stock, smarter allocation and region-specific campaigns." },
      { title: "Designed the product side", body: "Three virtual-fashion concepts tied to the brand: a rainproof light cape in recycled nylon with LED lighting, heating and app control; a touchscreen Kira smart bracelet with seasonal patterns sold as limited drops; and Aurora high-tech sneakers with an LED sole, GPS tracking, auto-locking laces and posture tracking, built around women's safety and wellness." },
    ],
    results: [
      { value: "3", label: "technology interventions", how: "AI clienteling, blockchain traceability, RFID with AI allocation; coursework proposals" },
      { value: "3", label: "wearable-tech product concepts", how: "Cape, Kira smart bracelet, Aurora sneakers; rendered, not manufactured" },
      { value: "1", label: "store-manager interview", how: "SoHo flagship; the basis of the operational diagnosis" },
    ],
    limits: [
      "A course project: proposals were not commissioned or tested by Tory Burch.",
      "Revenue, store and channel figures are public estimates cited in the report.",
    ],
    shots: [
      s("tb-aurora", "Aurora sneaker concept: LED sole, GPS and auto-locking laces (rendered with Midjourney)", "1 / 1"),
      s("tb-cape", "Rainproof light cape concept with embedded LED strips", "1 / 1"),
      s("tb-cape-spec", "The cape's spec view: recycled waterproof shell, heating and app control", "1 / 1"),
      s("tb-kira", "Kira smart bracelet: a touchscreen take on the brand's best-selling bangle", "1 / 1"),
      s("tb-aurora-night", "Aurora at night: visibility as a safety feature", "1 / 1"),
    ],
    sources: [],
  },

  /* ------------------------------------------------------------------ */
  "merch-1": {
    status: "Academic capstone · prototype; conversion figure modelled",
    glance: {
      what: "Nava Collective: a trust-first marketplace for independent streetwear and upcycling labels, from survey to working prototype.",
      role: "Research, business model, product requirements and prototype",
      when: "2024 – 2025",
      where: "Parsons MPS Fashion Management capstone",
      why: "Small labels get buried on big marketplaces, and buyers struggle to trust makers they cannot find.",
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
    status: "Seasonal role · sales figures self-reported",
    glance: {
      what: "Selling and clienteling across 12+ designer menswear brands on a flagship floor through peak season.",
      role: "Brand Representative, Men's Designer & Sportswear (seasonal)",
      when: "September 2025 – January 2026",
      where: "Bloomingdale's, 59th Street, New York",
      why: "Designer customers compare fit, price and stock across brands in one visit; capturing what they ask for is merchandising data.",
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
    status: "Student-run event · figures as reported",
    glance: {
      what: "The launch marketing and event operations for Genesis 2.2, NIFT Delhi's freshers' event.",
      role: "Head of Marketing and Event Operations; produced the reel soundtrack and designed the event website",
      when: "B.F.Tech second year (the artwork is dated 2022)",
      where: "Genesis 2.2, NIFT Delhi's freshers' event, run each year by the second-year cohort",
      why: "Students pick events on excitement and safety; the campaign had to earn both to sell tickets.",
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
    status: "Coursework · scores derived from a qualitative review",
    glance: {
      what: "A side-by-side UX benchmark of Myntra and Urbanic against ten UX laws, with scores.",
      role: "Sole analyst",
      when: "NIFT Delhi, Master of Fashion Management interdisciplinary coursework",
      where: "Myntra vs. Urbanic, desktop experience",
      why: "To show what a stronger fashion e-commerce experience does differently, and where each platform loses shoppers.",
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
    status: "Coursework · speculative brief; targets, not results",
    glance: {
      what: "HUMAN: a speculative campaign and media plan for Off-White, built on Virgil Abloh's construction marks.",
      role: "Concept, social strategy and media plan (final project)",
      when: "Parsons MPS, Communication & Social Media",
      where: "Speculative brief for Off-White; not commissioned by the brand",
      why: "To bring the brand's voice back to the street as something useful, not just another product drop.",
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
