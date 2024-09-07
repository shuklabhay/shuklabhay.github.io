import {
  AwardData,
  GHStatsData,
  PositionsData,
  ProjectData,
  SkillsData,
} from "./types";

export default async function loadSiteData() {
  const awards = await getAwardData();
  const ghStats = await getGHStatsData();
  const positions = await getPositionsData();
  const projects = await getProjectsData();
  const skills = await getSkillsData();

  return {
    awards,
    ghStats,
    positions,
    projects,
    skills,
  };
}

async function getAwardData(): Promise<AwardData[]> {
  try {
    const response = await fetch(`sitedata/awards.json`);
    const data: AwardData[] = await response.json();
    return data;
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

async function getPositionsData(): Promise<PositionsData[]> {
  try {
    const response = await fetch(`sitedata/positions.json`);
    const data: PositionsData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [] as unknown as PositionsData[];
  }
}

async function getProjectsData(): Promise<ProjectData[]> {
  try {
    const response = await fetch(`sitedata/projects.json`);
    const data: ProjectData[] = await response.json();
    return data;
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
