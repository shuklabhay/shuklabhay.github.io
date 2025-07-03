import { RefObject } from "react";

// GitHub API
export type GitHubRestReturn = any;
export type GitHubRepo = any;

// Compiled data types

export interface SiteData {
  activities: ActivityItem[];
  awards: AwardItem[];
  contact: ContactItem[];
  education: EducationItem[];
  ghData: GHData;
  projects: ProjectItem[];
  skills: SkillData;
}
export interface ResumeData {
  activities: ActivityItem[];
  awards: AwardItem[];
  contact: ContactItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillData;
}

export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
}

// Individual data types
export type RichImage = { src: string; alt: string };
export type RichIcon = { src: string; link: string };
export type RichLink = [{ url: string; description: string }];

export type BulletPoint = { point: string };
export type Skill = string;

export interface ActivityItem {
  org: string;
  position: string;
  startYear: string;
  endYear: string | "Present";
  ongoing: boolean;
  details: BulletPoint[];
  icon: RichIcon | null;
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface AwardItem {
  title: string;
  receivedYear: string;
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface ContactItem {
  title: string;
  link: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  gpa: string;
  location: string;
}

export interface ProjectItem {
  title: string;
  broadDescription: string;
  details: BulletPoint[];
  experience: string;
  images: RichImage[];
  link: RichLink;
  hideOnSite: boolean;
  hideOnResume: boolean;
}

export interface SkillData {
  technical: Skill[];
  other: Skill[];
}

export const stringToDetails = (info: string) => {
  return [{ point: info }];
};

// Counting Animation
export type counterAnimationInfo = { label: string; finalValue: number };
export interface CountHookResult {
  ref: RefObject<HTMLSpanElement>;
  startAnimation: () => void;
}
export interface CountingAnimationLabelProps {
  counterAnimationInfo: counterAnimationInfo[];
}

// Application handliing
export type ScrollInfo = {
  landingPosition: number;
  experiencePosition: number;
  skillsPosition: number;
  aboutMePosition: number;
  isLandingFocused: boolean;
  isExperienceFocused: boolean;
  isSkillsFocused: boolean;
  isAboutMeFocused: boolean;
};

export type AppContextType = {
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
