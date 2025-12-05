import fs from "fs/promises";
import path from "path";
import {
  ABOUT_ALLOWED_TAGS,
  AwardRecord,
  ContactRecord,
  EducationRecord,
  ExperienceRecord,
  ProjectRecord,
  ResumeData,
  SkillsRecord,
} from "./types";
import { filterItemsByDetailTags, parseTags } from "./tags";

const DATA_DIR = path.resolve(process.cwd(), "public", "sitedata");
const DESIRED_TAGS = new Set(["ml", "software", "growth"]);

async function loadJSON<T>(fileName: string): Promise<T> {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function filterExperience(experience: ExperienceRecord[]): ExperienceRecord[] {
  return filterItemsByDetailTags(
    experience.filter((item) => !item.hide),
    DESIRED_TAGS,
    ABOUT_ALLOWED_TAGS,
  ).map((item) => ({
    ...item,
    details: item.details.map((detail) => ({
      ...detail,
      tags: detail.tags ?? [],
    })),
  }));
}

function filterProjects(projects: ProjectRecord[]): ProjectRecord[] {
  return filterItemsByDetailTags(
    projects.filter((item) => !item.hide),
    DESIRED_TAGS,
    ABOUT_ALLOWED_TAGS,
  ).map((item) => ({
    ...item,
    tags: item.tags ?? [],
    details: item.details.map((detail) => ({
      ...detail,
      tags: detail.tags ?? [],
    })),
  }));
}

function filterAwards(awards: AwardRecord[]): AwardRecord[] {
  return awards
    .filter((award) => !award.hide)
    .filter((award) => {
      const tags = parseTags(award.tags);
      if (tags.includes("always")) return true;
      return tags.some((tag) => DESIRED_TAGS.has(tag));
    });
}

export async function getJSONDataForResume(): Promise<ResumeData> {
  const [experience, projects, education, awards, contact, skills] =
    await Promise.all([
      loadJSON<ExperienceRecord[]>("experience.json"),
      loadJSON<ProjectRecord[]>("projects.json"),
      loadJSON<EducationRecord[]>("education.json"),
      loadJSON<AwardRecord[]>("awards.json"),
      loadJSON<ContactRecord[]>("contact.json"),
      loadJSON<SkillsRecord>("skills.json"),
    ]);

  return {
    experience: filterExperience(experience),
    projects: filterProjects(projects),
    education,
    awards: filterAwards(awards),
    contact,
    skills,
  };
}
