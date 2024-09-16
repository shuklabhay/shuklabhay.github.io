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

async function getAwardData(): Promise<AwardItem[]> {
  try {
    const response = await fetch(`sitedata/awards.json`);
    const data: AwardItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as AwardItem[];
  }
}

async function getGHData(): Promise<GHData> {
  try {
    const response = await fetch(`sitedata/ghdata.json`);
    const data: GHData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as GHData;
  }
}

async function getPositionsData(): Promise<PositionItem[]> {
  try {
    const response = await fetch(`sitedata/positions.json`);
    const data: PositionItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as PositionItem[];
  }
}

async function getProjectsData(): Promise<ProjectItem[]> {
  try {
    const response = await fetch(`sitedata/projects.json`);
    const data: ProjectItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as ProjectItem[];
  }
}

async function getSkillsData(): Promise<SkillItem[]> {
  try {
    const response = await fetch(`sitedata/skills.json`);
    const data: SkillItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as SkillItem[];
  }
}

async function getContactData(): Promise<ContactItem[]> {
  try {
    const response = await fetch(`sitedata/contact.json`);
    const data: ContactItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as ContactItem[];
  }
}
