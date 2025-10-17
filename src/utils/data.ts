import {
  AwardItem,
  ContactItem,
  GHData,
  ActivityItem,
  ProjectItem,
  ResumeData,
  SiteData,
  SkillData,
  EducationItem,
} from "./types";

import activitiesData from "../../public/sitedata/activities.json";
import awardsData from "../../public/sitedata/awards.json";
import contactData from "../../public/sitedata/contact.json";
import educationData from "../../public/sitedata/education.json";
import ghData from "../../public/sitedata/ghdata.json";
import projectsData from "../../public/sitedata/projects.json";
import skillsData from "../../public/sitedata/skills.json";

export function getJSONDataForSite(): SiteData {
  return {
    activities: activitiesData as ActivityItem[],
    awards: awardsData as AwardItem[],
    contact: contactData as ContactItem[],
    education: educationData as EducationItem[],
    ghData: ghData as GHData,
    projects: projectsData as ProjectItem[],
    skills: skillsData as SkillData,
  };
}

export function getJSONDataForResume(): ResumeData {
  return {
    activities: activitiesData as ActivityItem[],
    awards: awardsData as AwardItem[],
    contact: contactData as ContactItem[],
    education: educationData as EducationItem[],
    projects: projectsData as ProjectItem[],
    skills: skillsData as SkillData,
  };
}
