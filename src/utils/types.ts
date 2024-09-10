import { RefObject } from "react";

//  Data Types
export type RichImage = { src: string; alt: string };
export type RichIcon = { src: string; link: string };
export type RichLink = { url: string; displayText: string };

export interface SignificantRepoInfo {
  repo: string;
  description: string;
  link: string;
}
export type BulletPoint = { point: string };

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
  significantRepos: SignificantRepoInfo[];
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
  description: BulletPoint[];
  contribution: string;
  experience: string;
  images: RichImage[];
  links: RichLink[];
}

export interface SkillsData {
  skill: string;
}

// Counting Label Animation
export type counterAnimationInfo = { label: string; finalValue: number };
export interface CountHookResult {
  ref: RefObject<HTMLSpanElement>;
  startAnimation: () => void;
}
export interface CountingAnimationLabelProps {
  counterAnimationInfo: counterAnimationInfo[];
}

// Scrolling and Navigation
export type ScrollInfo = {
  landingPosition: number;
  experiencePosition: number;
  skillsPosition: number;
  contactPosition: number;
  isLandingFocused: boolean;
  isExperienceFocused: boolean;
  isSkillsFocused: boolean;
  isContactFocused: boolean;
};

export type ScrollContextType = {
  scrollInformation: ScrollInfo;
  setScrollInformation: React.Dispatch<React.SetStateAction<ScrollInfo>>;
  scrollProgress: number;
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>;
};

export type NavItem = {
  label: string;
  position: Extract<keyof ScrollInfo, string>;
  focused: Extract<keyof ScrollInfo, string>;
};
