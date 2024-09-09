import { ScrollInfo } from "./scrollContext";

// Page Data Types
export type RichImage = { src: string; alt: string };
export type RichIcon = { src: string; link: string };
export type RichLink = { url: string; displayText: string };
export type significantRepoInfo = {
  repo: string;
  description: string;
  link: string;
};

export interface SiteData {
  awards: AwardData[];
  ghData: GHData;
  projects: ProjectData[];
  positions: PositionsData[];
  skills: SkillsData[];
}

export interface AwardData {
  title: string;
  recievedMonth: string;
  description: string;
}

export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
  significantRepos: significantRepoInfo[];
}

export interface PositionsData {
  title: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  description: string;
  icon: RichIcon;
}

export interface ProjectData {
  title: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  description: string;
  contribution: string;
  accomplishments: string;
  images: RichImage[];
  links: RichLink[];
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
