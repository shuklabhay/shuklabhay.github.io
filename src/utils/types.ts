type InformativeLink = { link: string; displayText: string };

interface AwardData {
  title: string;
  recievedMonth: Date;
  description: string;
}

interface GHStatsData {
  commits: number;
  linesWritten: number;
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
