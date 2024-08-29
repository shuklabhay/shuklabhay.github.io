type InformativeLink = { link: string; displayText: string };

interface ProjectData {
  title: string;
  startMonth: Date[];
  endMonth: Date[];
  description: string;
  contribution: string;
  acomplishments: string;
  images: string[]; // image paths
  links: InformativeLink[];
}

interface AwardData {
  title: string;
  recievedMonth: Date[];
  description: string;
}
