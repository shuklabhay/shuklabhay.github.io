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
} from "./types";

// File names
const awardFileName = "awards.json";
const ghDataFileName = "ghdata.json";
const activitiesFileName = "activities.json";
const projectsFileName = "projects.json";
const skillsFileName = "skills.json";
const contactFileName = "contact.json";

// Access data to use on website
export async function getJSONDataForSite() {
  const awards = await getAwardDataForSite();
  const ghData = await getGHDataForSite();
  const activities = await getActivitiesDataForSite();
  const projects = await getProjectsDataForSite();
  const skills = await getSkillsDataForSite();
  const contact = await getContactDataForSite();

  return {
    awards,
    ghData,
    activities,
    projects,
    skills,
    contact,
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

async function getAwardDataForSite(): Promise<AwardItem[]> {
  return readJSONForSite<AwardItem[]>(awardFileName);
}

async function getGHDataForSite(): Promise<GHData> {
  return readJSONForSite<GHData>(ghDataFileName);
}

async function getActivitiesDataForSite(): Promise<ActivityItem[]> {
  return readJSONForSite<ActivityItem[]>(activitiesFileName);
}

async function getProjectsDataForSite(): Promise<ProjectItem[]> {
  return readJSONForSite<ProjectItem[]>(projectsFileName);
}

async function getSkillsDataForSite(): Promise<SkillData> {
  return readJSONForSite<SkillData>(skillsFileName);
}

async function getContactDataForSite(): Promise<ContactItem[]> {
  return readJSONForSite<ContactItem[]>(contactFileName);
}

// Access data to use on resume
export async function getJSONDataForResume() {
  const awards = await getAwardDataForResume();
  const activities = await getActivitiesDataForResume();
  const projects = await getProjectsDataForResume();
  const skills = await getSkillsDataForResume();
  const contact = await getContactDataForResume();

  return {
    awards,
    activities,
    projects,
    skills,
    contact,
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

async function getAwardDataForResume(): Promise<AwardItem[]> {
  return readJSONFileForResume<AwardItem[]>(awardFileName);
}

async function getActivitiesDataForResume(): Promise<ActivityItem[]> {
  return readJSONFileForResume<ActivityItem[]>(activitiesFileName);
}

async function getProjectsDataForResume(): Promise<ProjectItem[]> {
  return readJSONFileForResume<ProjectItem[]>(projectsFileName);
}

async function getSkillsDataForResume(): Promise<SkillData> {
  return readJSONFileForResume<SkillData>(skillsFileName);
}

async function getContactDataForResume(): Promise<ContactItem[]> {
  return readJSONFileForResume<ContactItem[]>(contactFileName);
}
