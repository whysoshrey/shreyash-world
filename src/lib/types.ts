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
};

export type Door = {
  key: DoorKey;
  title: string;
  thesis: string;
};

export type Artifact = { label: string; url: string; actionId?: string };

export type Exhibit = {
  id: string;
  title: string;
  context: string;
  proof: string;
  problem: string;
  approach: string[];
  impact: string[];
  skills: string;
  artifacts: Artifact[];
};

export type Content = {
  site: Site;
  doors: Door[];
  exhibits: Record<DoorKey, Exhibit[]>;
};
