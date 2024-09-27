import {
  AwardItem,
  ContactItem,
  GHData,
  PositionItem,
  ProjectItem,
  SkillItem,
} from "./types";

export default async function useSiteData() {
  const awards = await getAwardData();
  const ghData = await getGHData();
  const positions = await getPositionsData();
  const projects = await getProjectsData();
  const skills = await getSkillsData();
  const contact = await getContactData();

  return {
    awards,
    ghData,
    positions,
    projects,
    skills,
    contact,
  };
}

async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const response = await fetch(`/sitedata/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching data from ${filename}:`, error);
    return [] as unknown as T;
  }
}

async function getAwardData(): Promise<AwardItem[]> {
  return readJsonFile<AwardItem[]>("awards.json");
}

async function getGHData(): Promise<GHData> {
  return readJsonFile<GHData>("ghdata.json");
}

async function getPositionsData(): Promise<PositionItem[]> {
  return readJsonFile<PositionItem[]>("positions.json");
}

async function getProjectsData(): Promise<ProjectItem[]> {
  return readJsonFile<ProjectItem[]>("projects.json");
}

async function getSkillsData(): Promise<SkillItem[]> {
  return readJsonFile<SkillItem[]>("skills.json");
}

async function getContactData(): Promise<ContactItem[]> {
  return readJsonFile<ContactItem[]>("contact.json");
}
