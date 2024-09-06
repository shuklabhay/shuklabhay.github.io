import { ScrollInfo } from "./scrollContext";

// Page Data Types
export type InformativeImage = { src: string; alt: string };
export type InformativeLink = { url: string; displayText: string };

export interface SiteData {
  awards: AwardData[];
  ghStats: GHStatsData;
  projects: ProjectData[];
  skills: SkillsData[];
}

export interface AwardData {
  title: string;
  recievedMonth: string;
  description: string;
}

export interface GHStatsData {
  contributions: number;
  linesModified: number;
}

export interface ProjectData {
  title: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  description: string;
  contribution: string;
  acomplishments: string;
  images: InformativeImage[];
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
