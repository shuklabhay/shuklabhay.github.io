import { renderToStaticMarkup } from "react-dom/server";
import { getJSONDataForResume } from "../utils/data.ts";
import { ResumeData } from "../utils/types.ts";
import { getTimeframeLabel } from "../utils/dates.ts";
import fs from "fs/promises";

function parseDataToTexTemplate(userData: ResumeData) {
  const { activities, awards, contact, education, projects, skills } = userData;

  const technicalSkillsList = skills.technical.map((skill) => skill).join(", ");
  const otherSkillsList = skills.other.map((skill) => skill).join(", ");
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
]{resume} % Use the resume class

\\usepackage{ebgaramond} % Use the EB Garamond font
\\usepackage{hyperref}

%------------------------------------------------

\\name{Abhay Shukla} % Your name to appear at the top

% You can use the \\address command up to 3 times for 3 different addresses or pieces of contact information
% Any new lines you use in the \\address commands will be converted to symbols, so each address will appear as a single line.
\\address{${getContactLink("Email")} $\\vert$ \\underline{\\href{${getContactLink("Linkedin")}}{${getContactLink("Linkedin")}}} $\\vert$ \\underline{\\href{${getContactLink("GitHub")}}{${getContactLink("GitHub")}}} $\\vert$ \\underline{\\href{${getContactLink("Website")}}{${getContactLink("Website")}}}}% Contact information

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
  \\begin{rSubsection}{${activity.org}}{${getTimeframeLabel(activity.startYear, activity.endYear, activity.ongoing)}}{${activity.position}}{California}
    ${activity.details
      .map((detail) => {
        return `
    \\item ${detail.point}
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
        return `
  \\begin{rSubsection}{${project.title}}{}{${project.link[0] ? project.link[0].description + `: \\underline{\\href{${project.link[0].url}}{${project.link[0].url}}}` : ""}}{}
       ${project.details
         .map((detail) => {
           return `
    \\item ${detail.point}
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
  \\textbf{${item.school}} \\hfill \\textit{${item.gpa}} \\\\
  ${item.degree} \\hfill \\textit{${item.location}}`;
    })
    .join("")}
	
\\end{rSection}

%----------------------------------------------------------------------------------------
    %	SKILLS SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Skills}

  \\begin{tabular}{@{} >{\\bfseries}l @{\\hspace{6ex}} l @{}}
		Technical Fields & ${technicalSkillsList} \\\\
    Other & ${otherSkillsList} \\\\
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
      \\item ${award.title} \\hfill ${award.recievedYear}
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
  const texFilePath = "public/resume/resume.tex";
  const userData = await getJSONDataForResume();
  const texString = renderToStaticMarkup(parseDataToTexTemplate(userData));

  // Process string
  let processedTexString = texString;

  const replacements = [
    { key: "&amp;", value: "&" },
    { key: "&#x27;", value: "'" },
    { key: "\\$4800\\+", value: "\\$4800+" },
    { key: "&lt;4.6%", value: "\\<4.6\\%" },
    { key: "&gt;", value: ">" },
    { key: "Mathematics & Science", value: "Mathematics \\& Science" },
  ];
  for (const { key, value } of replacements) {
    const regex = new RegExp(key, "g");
    processedTexString = processedTexString.replace(regex, value);
  }

  // Write tex file
  try {
    await fs.writeFile(texFilePath, processedTexString);
    console.log(`Resume saved to ${texFilePath}`);
  } catch (error) {
    console.error("Error saving the resume:", error);
  }
}

await saveTexResume();
