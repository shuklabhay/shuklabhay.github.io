import escapeLatex from "escape-latex";
import fs from "fs/promises";
import { getJSONDataForResume } from "../utils/resume.ts";
import { formatDate, formatDateRange } from "../utils/dates.ts";
import { ResumeData } from "../utils/types.ts";

function formatRange(start: string | null, end: string | null): string {
  if (!start) return "";
  const output = formatDateRange(start, end ?? "Present", true);
  return output.replace(/–/g, "--");
}

function parseDataToTexTemplate(userData: ResumeData) {
  const { experience, projects, education, awards, contact, skills } = userData;

  const e = escapeLatex;

  const technicalSkillsList =
    skills.technical.length > 0 ? e(skills.technical.join(", ")) : "";
  const otherSkillsList =
    skills.other.length > 0 ? e(skills.other.join(", ")) : "";

  const getContactLink = (title: string) => {
    const titleLower = title.toLowerCase();
    return contact.find((item) => item.title.toLowerCase() === titleLower)
      ?.link;
  };

  const email = getContactLink("Email");
  const linkedIn = getContactLink("LinkedIn");
  const github = getContactLink("GitHub");
  const website = getContactLink("Website");

  const contactSegments = [
    email ? `\\underline{\\href{mailto:${email}}{${e(email)}}}` : null,
    linkedIn ? `\\underline{\\href{${linkedIn}}{${e(linkedIn)}}}` : null,
    github ? `\\underline{\\href{${github}}{${e(github)}}}` : null,
    website ? `\\underline{\\href{${website}}{${e(website)}}}` : null,
  ].filter(Boolean);

  const experienceSection = experience
    .map((item) => {
      if (!item.details || item.details.length === 0) return "";
      const timeframe = e(formatRange(item.startYear, item.endYear));
      const location =
        item.location && item.location.trim().length > 0
          ? e(item.location)
          : "";

      return `
  \\begin{rSubsection}{${e(item.org)}}{${timeframe}}{${e(item.position)}}{${location}}
${item.details.map((detail) => `    \\item ${e(detail.point)}`).join("\n")}
  \\end{rSubsection>`;
    })
    .filter(Boolean)
    .join("\n\n");

  const projectSection = projects
    .map((project) => {
      if (!project.details || project.details.length === 0) return "";
      const primaryLink =
        project.link && project.link.length > 0 ? project.link[0] : null;
      const linkSection = primaryLink
        ? ` - \\textit{\\underline{\\href{${primaryLink.url}}{${e(primaryLink.description)}}}}`
        : "";

      const timeframeValue = formatRange(
        project.startYear ?? null,
        project.endYear ?? null,
      );
      const timeframe = timeframeValue ? e(timeframeValue) : "";

      return `
  \\begin{rSubsection}{${e(project.title)}${linkSection}}{${timeframe}}{}{}
${project.details.map((detail) => `    \\item ${e(detail.point)}`).join("\n")}
  \\end{rSubsection>`;
    })
    .filter(Boolean)
    .join("\n\n");

  const awardSection = awards
    .map((award) => {
      const formattedYear = formatDate(award.receivedYear, true);
      const safeYear = e(formattedYear.replace(/–/g, "--"));
      const issuerAndTitle = `${award.issuer}: ${award.title}`;
      return `      \\item ${e(issuerAndTitle)} \\hfill ${safeYear}`;
    })
    .join("\n");

  // you need to manually use \\ for each \
  return `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Medium Length Professional CV
% LaTeX Template
% Version 3.0 (December 17, 2022)
%
% This template originates from:
% https://www.LaTeXTemplates.com
%
% Author:
% Vel (vel@latextemplates.com)
%
% Original author:
% Trey Hunner (http://www.treyhunner.com/)
%
% License:
% CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%----------------------------------------------------------------------------------------
%	PACKAGES AND OTHER DOCUMENT CONFIGURATIONS
%----------------------------------------------------------------------------------------

\\documentclass[
  %a4paper, % Uncomment for A4 paper size (default is US letter)
  10pt, % Default font size, can use 10pt, 11pt or 12pt
]{resume}

\\usepackage{times}
\\usepackage{hyperref}
\\hyphenpenalty=10000
\\exhyphenpenalty=10000
\\frenchspacing

%------------------------------------------------

\\name{Abhay Shukla} % Your name to appear at the top

% You can use the \\address command up to 3 times for 3 different addresses or pieces of contact information
% Any new lines you use in the \\address commands will be converted to symbols, so each address will appear as a single line.
\\address{${contactSegments.join(" $\\vert$ ")}}% Contact information

%----------------------------------------------------------------------------------------

\\begin{document}
\\sloppy

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Experience}

${experienceSection}

\\end{rSection}

%----------------------------------------------------------------------------------------
%	PROJECTS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Projects}

${projectSection}

\\end{rSection}

%----------------------------------------------------------------------------------------
%	EDUCATION SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Education}

${education
  .map((item) => {
    const gpa = item.gpa ? ` \\hfill \\textit{${e(item.gpa)}}` : "";
    const location = item.location
      ? ` \\hfill \\textit{${e(item.location)}}`
      : "";
    return `  \\textbf{${e(item.school)}}${gpa} \\\\
  ${e(item.degree)}${location}`;
  })
  .join("\n\n")}

\\end{rSection}

%----------------------------------------------------------------------------------------
    %	SKILLS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Skills}

  \\begin{tabular}{@{} >{\\bfseries}l @{\\hspace{6ex}} l @{}}
${[
  technicalSkillsList ? `    Technical & ${technicalSkillsList} \\\\` : "",
  otherSkillsList ? `    Other & ${otherSkillsList} \\\\` : "",
]
  .filter(Boolean)
  .join("\n")}
	\\end{tabular}

\\end{rSection}

%----------------------------------------------------------------------------------------
    % HONORS & AWARDS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Honors \\& Awards}

  \\begin{itemize}
      \\setlength\\itemsep{-0.7em} % Adjust the space between items
${awardSection}

    \\end{itemize}

\\end{rSection}

\\end{document}
`;
}

async function saveTexResume() {
  // Read JSON Data
  const texFilePath = "public/resume.tex";
  const userData = await getJSONDataForResume();
  const texString = parseDataToTexTemplate(userData);

  // Write tex file
  try {
    await fs.writeFile(texFilePath, texString);
    console.log(`Resume saved to ${texFilePath}`);
  } catch (error) {
    console.error("Error saving the resume:", error);
  }
}

await saveTexResume();
