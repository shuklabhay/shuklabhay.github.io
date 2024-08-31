import { ScrollInfo } from "./scrollContext";

// Page Data Types
type InformativeLink = { link: string; displayText: string };

export interface SiteData {
  awards: AwardData[];
  ghStats: GHStatsData;
  projects: ProjectData[];
  skills: SkillsData[];
}

export interface AwardData {
  title: string;
  recievedMonth: Date;
  description: string;
}

export interface GHStatsData {
  contributions: number;
  linesModified: number;
}

export interface ProjectData {
  title: string;
  startMonth: Date;
  endMonth: Date;
  description: string;
  contribution: string;
  acomplishments: string;
  images: string[]; // image paths
  links: InformativeLink[];
}

export interface SkillsData {
  skill: string;
}

//Other
export type NavItem = {
  label: string;
  position: Extract<keyof ScrollInfo, string>;
  focused: Extract<keyof ScrollInfo, string>;
};
