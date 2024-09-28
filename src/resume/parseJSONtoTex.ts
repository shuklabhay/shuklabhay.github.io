import { renderToStaticMarkup } from "react-dom/server";
import { getJSONDataForResume } from "../utils/data.ts";
import { ResumeData } from "../utils/types.ts";

function parseDataToTexTemplate(userData: ResumeData) {
  const { awards, positions, projects, skills, contact } = userData;

  const getContactLink = (title: string) => {
    const titleLower = title.toLowerCase();

    return contact.find((item) => item.title.toLowerCase() === titleLower)
      ?.link;
  };

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
  11pt, % Default font size, can use 10pt, 11pt or 12pt
]{src/resume/resume} % Use the resume class

\\usepackage{ebgaramond} % Use the EB Garamond font
\\usepackage{hyperref}

%------------------------------------------------

\\name{Abhay Shukla} % Your name to appear at the top

% You can use the \\address command up to 3 times for 3 different addresses or pieces of contact information
% Any new lines you use in the \\address commands will be converted to symbols, so each address will appear as a single line.
// \\address{${getContactLink("Email")} $\vert$ \\underline{\\href{${getContactLink("Linkedin")}}{${getContactLink("Linkedin")}}} $\vert$ \\underline{\\href{${getContactLink("GitHub")}}{${getContactLink("GitHub")}}} $\vert$ \\underline{\\href{${getContactLink("Website")}}{${getContactLink("Website")}}}}% Contact information

%----------------------------------------------------------------------------------------

\begin{document}

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE SECTION
%----------------------------------------------------------------------------------------

\\begin{rSection}{Experience}

${positions
  .map(() => {
    return `
  \\begin{rSubsection}{{{experience_org}}}{{{experience_time}}}{{{experience_role}}}{{{experience_location}}}
  \\item {{experience_point}}   
  \\end{rSubsection}
    `;
  })
  .join("")}
	

%------------------------------------------------

\\end{rSection}

`;
}

async function getTexStrings() {
  // Read JSON data
  const userData = await getJSONDataForResume();
  const texString = renderToStaticMarkup(parseDataToTexTemplate(userData));
  console.log(texString);
}

await getTexStrings();
