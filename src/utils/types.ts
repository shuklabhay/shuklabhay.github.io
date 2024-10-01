import { RefObject } from "react";

// GitHub API
export type GitHubRestReturn = any;
export type GitHubRepo = any;

//  Data Types
export type RichImage = { src: string; alt: string };
export type RichIcon = { src: string; link: string };
export type RichLink = { url: string; displayText: string };

export type BulletPoint = { point: string };
export type Skill = string;

export interface SiteData {
  awards: AwardItem[];
  ghData: GHData;
  projects: ProjectItem[];
  positions: PositionItem[];
  skills: SkillData;
  contact: ContactItem[];
}
export interface ResumeData {
  awards: AwardItem[];
  projects: ProjectItem[];
  positions: PositionItem[];
  skills: SkillData;
  contact: ContactItem[];
}

export interface AwardItem {
  title: string;
  recievedMonth: string;
  description: string;
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
}

export interface PositionItem {
  org: string;
  position: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  details: BulletPoint[];
  icon: RichIcon;
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface ProjectItem {
  title: string;
  type: string;
  broadDescription: string;
  details: BulletPoint[];
  experience: string;
  images: RichImage[];
  links: RichLink[];
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface SkillData {
  technical: Skill[];
  other: Skill[];
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
