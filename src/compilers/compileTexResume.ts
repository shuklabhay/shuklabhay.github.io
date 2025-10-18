import escapeLatex from "escape-latex";
import { getJSONDataForResume } from "../utils/data.ts";
import { ResumeData } from "../utils/types.ts";
import { getTimeframeLabel } from "../utils/dates.ts";
import fs from "fs/promises";

function parseDataToTexTemplate(userData: ResumeData) {
  const { activities, awards, contact, education, projects, skills } = userData;

  const e = escapeLatex;

  const technicalSkillsList = e(
    skills.technical.map((skill) => skill).join(", ")
  );
  const getContactLink = (title: string) => {
    const titleLower = title.toLowerCase();

    return contact.find((item) => item.title.toLowerCase() === titleLower)
      ?.link;
  };

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
\\address{${getContactLink("Email")} $\\vert$ \\underline{\\href{${getContactLink("LinkedIn")}}{${e(getContactLink("LinkedIn") || "")}}} $\\vert$ \\underline{\\href{${getContactLink("GitHub")}}{${e(getContactLink("GitHub") || "")}}} $\\vert$ \\underline{\\href{${getContactLink("Website")}}{${e(getContactLink("Website") || "")}}}}% Contact information

%----------------------------------------------------------------------------------------

\\begin{document}
\\sloppy

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Experience}

${activities
  .map((activity) => {
    if (!activity.hideOnResume) {
      return `
  \\begin{rSubsection}{${e(activity.org)}}{${getTimeframeLabel(activity.startYear, activity.endYear, activity.ongoing)}}{${e(activity.position)}}{California}
    ${activity.details
      .map((detail) => {
        return `
    \\item ${e(detail.point)}
    `;
      })
      .join("")}
  \\end{rSubsection}
        `;
    }
  })
  .join("")}
	
\\end{rSection}

%----------------------------------------------------------------------------------------
%	PROJECTS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Projects}

  ${projects
    .map((project) => {
      if (!project.hideOnResume) {
        const linkSection = project.link[0]
          ? ` - \\textit{\\underline{\\\href{${project.link[0].url}}{${e(project.link[0].description)}}}}`
          : "";

        return `
    \\begin{rSubsection}{${e(project.title)}${linkSection}}{}{}{}
        ${project.details
          .map((detail) => {
            return `
      \\item ${e(detail.point)}
          `;
          })
          .join("")}
    \\end{rSubsection}
        `;
      }
    })
    .join("")}

\\end{rSection}
    
%----------------------------------------------------------------------------------------
%	EDUCATION SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Education}
	
  ${education
    .map((item) => {
      return `
  \\textbf{${e(item.school)}} \\hfill \\textit{${e(item.gpa)}} \\\\
  ${e(item.degree)} \\hfill \\textit{${e(item.location)}}`;
    })
    .join("")}
	
\\end{rSection}

%----------------------------------------------------------------------------------------
    %	SKILLS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Skills}
 
  \\begin{tabular}{@{} >{\\bfseries}l @{\\hspace{6ex}} l @{}}
		Technical Fields & ${technicalSkillsList} \\\\
	\\end{tabular}

\\end{rSection}

%----------------------------------------------------------------------------------------
    % HONORS & AWARDS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Honors \\& Awards}

  \\begin{itemize}
      \\setlength\\itemsep{-0.7em} % Adjust the space between items
        ${awards
          .map((award) => {
            if (!award.hideOnResume) {
              return `
      \\item ${e(award.title)} \\hfill ${award.receivedYear}
              `;
            }
          })
          .join("")}


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
