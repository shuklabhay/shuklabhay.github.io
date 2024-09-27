import useSiteData from "../utils/useSiteData.ts";

async function getTexStrings() {
  // Read JSON data
  const siteData = await useSiteData();
  const awards = siteData.awards;
  const contact = siteData.contact;
  const positions = siteData.positions;
  const projects = siteData.projects;
  const skills = siteData.skills;

  // const contactInfo = `\\address{${contact
  //   .map((contact) => {
  //     return contact.title === "Email"
  //       ? contact.link
  //       : `\\underline{\\href{${contact.link}}{${contact.link}}}`;
  //   })
  //   .join(" $\\vert$ ")}}% Contact information`;

  console.log("fjdjdfjdfjdf");
}

getTexStrings();
