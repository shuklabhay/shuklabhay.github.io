import { ScrollInfo } from "./scrollContext";

// Page Data Types
export type RichImage = { src: string; alt: string };
export type RichIcon = { src: string; link: string };
export type RichLink = { url: string; displayText: string };

export interface SiteData {
  awards: AwardData[];
  ghStats: GHStatsData;
  projects: ProjectData[];
  positions: PositionsData[];
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
  acomplishments: string;
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
