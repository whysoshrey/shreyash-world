/**
 * Who stands behind each letter, and why their word carries weight.
 * Facts come from the letters themselves and from public faculty and research profiles (linked).
 */
export type Endorser = {
  name: string;
  /** one-line standing */
  standing: string;
  who: string[];
  why: string;
  /** what the letter actually vouches for, in the endorser's words or close paraphrase */
  vouches: string[];
  quote: string;
  sources: { label: string; url: string }[];
};

export const ENDORSERS: Record<string, Endorser> = {
  "cred-2": {
    name: "Prof. Pritika Bawa",
    standing: "Joint Director of the NIFT Delhi campus when she wrote; faculty, Department of Fashion Management Studies",
    who: [
      "On NIFT Delhi's faculty since 2008, after working in the fashion and apparel industry from 1998.",
      "Associate professor in Fashion Management Studies with a PhD; coordinates continuing-education programmes at NIFT Delhi.",
      "Signed her letter as Joint Director, NIFT Delhi Campus, part of the campus leadership.",
    ],
    why:
      "She judged the business side of my work: the venture plan, the campaign research and the UX study, in a 35-student interdisciplinary Master of Fashion Management class. She also saw me outside class as one of the faculty heads.",
    vouches: [
      "Placed me in the top 1% of her class of 35 in the interdisciplinary Master of Fashion Management major.",
      "Pods, a start-up plan she encouraged me to take forward as a serious business proposition.",
      "A fictional-product campaign whose survey showed 70% \"would buy\".",
      "A UI/UX comparison of high-end and low-end e-commerce platforms across 12 parameters.",
      "Off-White and consumer-subculture case studies on brand positioning.",
    ],
    quote: "Exceptional academic curiosity and solution-oriented thought process.",
    sources: [
      { label: "NIFT Delhi continuing-education programme list naming her as coordinator", url: "https://nift.ac.in/delhi/sites/delhi/files/2022-07/List%20of%20Diploma%20Courses%20(1).pdf" },
      { label: "Research profile, NIFT New Delhi", url: "https://www.researchgate.net/profile/Pritika-Bawa" },
    ],
  },
  "cred-3": {
    name: "Dr. Deepak Panghal",
    standing: "Faculty, Department of Fashion Technology, NIFT Delhi; mechanical engineer, PhD (NIT Surat)",
    who: [
      "Teaches Mechatronics, Additive Manufacturing and Robotics & Automation at NIFT Delhi.",
      "Researches additive manufacturing, AI, IoT and low-cost automation; his papers have been cited more than 860 times.",
      "Co-developed i-SMART with Prof. Prabir Jana, one of six innovations chosen from 200+ worldwide in the H&M Foundation's STITCH for RMG challenge.",
      "Co-founder of Apparel4tech, an apparel-manufacturing technology venture.",
    ],
    why:
      "He is the department's specialist in exactly the work I did: robotics, IoT and low-cost automation for apparel factories. He taught me directly and knew the robot project as it was selected for the Shahi Industry 4.0 fellowship.",
    vouches: [
      "Consistently in the top 5% of his 30-student junior-year class.",
      "A working automated assembly-line model and a line-following robot with obstacle avoidance.",
      "A faucet-leak detector built with Edge Impulse and MATLAB, at 85% accuracy.",
      "Neural-network training for apparel defect detection in MATLAB.",
      "Practical clarity with Arduino, Raspberry Pi and PLC units.",
    ],
    quote: "A student of exceptional dedication and proactivity.",
    sources: [
      { label: "Google Scholar profile", url: "https://scholar.google.com/citations?user=1gshpOgAAAAJ" },
      { label: "i-SMART wins H&M Foundation innovation challenge (Online Clothing Study)", url: "https://onlineclothingstudy.com/i-smart-by-nift-won-h-innovation-award/" },
      { label: "NIFT faculty and student research team page", url: "https://nift.ac.in/node/1098" },
    ],
  },
  "cred-10": {
    name: "Christina Lee",
    standing: "Part-time lecturer, Parsons School of Design (BBA and MPS programmes); adjunct instructor, FIT",
    who: [
      "25 years in lifestyle branding and multicultural marketing, building and managing brands for talent and companies in fashion and entertainment.",
      "Founder of chng+crw, a wellness lifestyle goods and experiences brand made in New York.",
      "Teaches at Parsons and at the Fashion Institute of Technology, where she also sits on the FIT Sustainability Council Board.",
    ],
    why:
      "She is a working brand strategist, not only an academic. She taught me Communication & Social Media in the Parsons MPS and assessed my final project, the Off-White campaign IN PROCESS → HUMAN.",
    vouches: [
      "A creative concept for Off-White supported by a cross-platform social media strategy.",
      "Connecting creative ideas to marketing objectives: brand identity, audience engagement and storytelling.",
      "Bringing a fashion-technology background into fashion-management discussions.",
      "Recommends me for brand marketing, communications and social media roles.",
    ],
    quote: "Creativity, strategic thinking, and a thoughtful approach to brand communication.",
    sources: [
      { label: "Parsons faculty profile", url: "https://www.newschool.edu/parsons/faculty/christina-lee-leec2/" },
      { label: "FIT faculty profile", url: "https://www.fitnyc.edu/creative-nexus/faculty/directory/lee-christina.php" },
    ],
  },
};
