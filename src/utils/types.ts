type InformativeLink = { link: string; displayText: string };

interface SiteData {
  awards: AwardData[];
  ghStats: GHStatsData;
  projects: ProjectData[];
  skills: SkillsData[];
}

interface AwardData {
  title: string;
  recievedMonth: Date;
  description: string;
}

interface GHStatsData {
  contributions: number;
  linesModified: number;
}

interface ProjectData {
  title: string;
  startMonth: Date;
  endMonth: Date;
  description: string;
  contribution: string;
  acomplishments: string;
  images: string[]; // image paths
  links: InformativeLink[];
}

interface SkillsData {
  skill: string;
}
