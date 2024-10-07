import fs from "fs/promises";
import path from "path";
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

// File names
const activitiesFileName = "activities.json";
const awardFileName = "awards.json";
const contactFileName = "contact.json";
const educationFileName = "education.json";
const ghDataFileName = "ghdata.json";
const projectsFileName = "projects.json";
const skillsFileName = "skills.json";

// Access data to use on website
export async function getJSONDataForSite() {
  const activities = await getActivitiesDataForSite();
  const awards = await getAwardDataForSite();
  const contact = await getContactDataForSite();
  const education = await getEducationDataForSite();
  const ghData = await getGHDataForSite();
  const projects = await getProjectsDataForSite();
  const skills = await getSkillsDataForSite();

  return {
    activities,
    awards,
    contact,
    education,
    ghData,
    projects,
    skills,
  } as SiteData;
}

async function readJSONForSite<T>(file: string): Promise<T> {
  try {
    const response = await fetch(`/sitedata/${file}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data as T;
  } catch (error) {
    console.error(`Error fetching data from ${file}:`, error);
    return [] as unknown as T; // Return an empty array in case of error
  }
}

async function getActivitiesDataForSite(): Promise<ActivityItem[]> {
  return readJSONForSite<ActivityItem[]>(activitiesFileName);
}

async function getAwardDataForSite(): Promise<AwardItem[]> {
  return readJSONForSite<AwardItem[]>(awardFileName);
}

async function getContactDataForSite(): Promise<ContactItem[]> {
  return readJSONForSite<ContactItem[]>(contactFileName);
}

async function getEducationDataForSite(): Promise<EducationItem[]> {
  return readJSONForSite<EducationItem[]>(educationFileName);
}

async function getGHDataForSite(): Promise<GHData> {
  return readJSONForSite<GHData>(ghDataFileName);
}

async function getProjectsDataForSite(): Promise<ProjectItem[]> {
  return readJSONForSite<ProjectItem[]>(projectsFileName);
}

async function getSkillsDataForSite(): Promise<SkillData> {
  return readJSONForSite<SkillData>(skillsFileName);
}

// Access data to use on resume
export async function getJSONDataForResume() {
  const activities = await getActivitiesDataForResume();
  const awards = await getAwardDataForResume();
  const contact = await getContactDataForResume();
  const education = await getEducationDataForResume();
  const projects = await getProjectsDataForResume();
  const skills = await getSkillsDataForResume();

  return {
    activities,
    awards,
    contact,
    education,
    projects,
    skills,
  } as ResumeData;
}

async function readJSONFileForResume<T>(file: string): Promise<T> {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.resolve(__dirname, `../../public/sitedata/${file}`);

    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error fetching data from ${file}:`, error);
    return [] as unknown as T;
  }
}

async function getActivitiesDataForResume(): Promise<ActivityItem[]> {
  return readJSONFileForResume<ActivityItem[]>(activitiesFileName);
}

async function getAwardDataForResume(): Promise<AwardItem[]> {
  return readJSONFileForResume<AwardItem[]>(awardFileName);
}

async function getContactDataForResume(): Promise<ContactItem[]> {
  return readJSONFileForResume<ContactItem[]>(contactFileName);
}

async function getEducationDataForResume(): Promise<EducationItem[]> {
  return readJSONFileForResume<EducationItem[]>(educationFileName);
}

async function getProjectsDataForResume(): Promise<ProjectItem[]> {
  return readJSONFileForResume<ProjectItem[]>(projectsFileName);
}

async function getSkillsDataForResume(): Promise<SkillData> {
  return readJSONFileForResume<SkillData>(skillsFileName);
}
