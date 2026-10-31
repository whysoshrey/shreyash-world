export type DoorKey = "ops" | "merch" | "brand" | "cred";

export type SiteLink = {
  label: string;
  href: string;
};

export type Site = {
  name: string;
  positioning: string;
  valueProp: string;
  cta: string;
  links: SiteLink[];
  /** public contact address (taken from the candidate's CV) */
  email?: string;
  /** user-stated location, regions and the roles sought */
  status?: { location: string; open: string; roles: string };
};

export type Door = {
  key: DoorKey;
  title: string;
  thesis: string;
};

export type Artifact = {
  label: string;
  url: string;
  actionId?: string;
  variant?: "hero";
};

export type Exhibit = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  context: string;
  proof: string;
  problem: string;
  approach: string[];
  impact: string[];
  skills: string;
  artifacts: Artifact[];
  /** other disciplines this project should also be listed under in filters */
  also?: DoorKey[];
};

export type Content = {
  site: Site;
  doors: Door[];
  exhibits: Record<DoorKey, Exhibit[]>;
};
