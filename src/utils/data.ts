import { AwardData, GHStatsData, ProjectData, SkillsData } from "./types";

export default async function loadProjectsData() {
  const awards = await getAwardData();
  const ghStats = await getGHStatsData();
  const projects = await getProjectsData();
  const skills = await getSkillsData();

  return {
    awards,
    ghStats,
    projects,
    skills,
  };
}

async function getAwardData(): Promise<AwardData[]> {
  try {
    const response = await fetch(`sitedata/awards.json`);
    const data: AwardData[] = await response.json();
    return data;
    //MAKE SURE THAT THE DATE COMPONENTS ARE PROPERLY MADE INTO DATE OBJECTS
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as AwardData[];
  }
}

async function getGHStatsData(): Promise<GHStatsData> {
  try {
    const response = await fetch(`sitedata/ghstats.json`);
    const data: GHStatsData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as GHStatsData;
  }
}

async function getProjectsData(): Promise<ProjectData[]> {
  try {
    const response = await fetch(`sitedata/projects.json`);
    const data: ProjectData[] = await response.json();
    return data;
    //MAKE SURE THAT THE DATE COMPONENTS ARE PROPERLY MADE INTO DATE OBJECTS
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as ProjectData[];
  }
}

async function getSkillsData(): Promise<SkillsData[]> {
  try {
    const response = await fetch(`sitedata/skills.json`);
    const data: SkillsData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as SkillsData[];
  }
}
