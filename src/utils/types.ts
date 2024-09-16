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
  awards: AwardItem[];
  ghData: GHData;
  projects: ProjectItem[];
  positions: PositionItem[];
  skills: SkillItem[];
  contact: ContactItem[];
}

export interface AwardItem {
  title: string;
  recievedMonth: string;
  description: string;
  hide: boolean;
}

export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
  significantRepos: SignificantRepoInfo[];
}

export interface PositionItem {
  title: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  description: string;
  icon: RichIcon;
}

export interface ProjectItem {
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

export interface SkillItem {
  skill: string;
}

export interface ContactItem {
  title: string;
  link: string;
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
