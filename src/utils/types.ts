interface ProjectData {
  title: string;
  startMonth: Date[];
  endMonth: Date[];
  description: string;
  contribution: string;
  acomplishments: string;
  images: string[]; // image paths
  links: string[];
}

interface AwardData {
  title: string;
  recievedMonth: Date[];
  description: string;
}
