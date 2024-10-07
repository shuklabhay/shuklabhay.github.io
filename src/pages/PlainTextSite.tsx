import { Container, Stack, Text } from "@mantine/core";
import { getJSONDataForSite } from "../utils/data";
import { useEffect, useState } from "react";
import { SiteData } from "../utils/types";

export default function PlainTextSite() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await getJSONDataForSite();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const activities = siteData.activities;
    const awards = siteData.awards;
    const contact = siteData.contact;
    const education = siteData.education;
    const projects = siteData.projects;
    const skills = siteData.skills;

    return (
      <>
        <Text fz={24} lh={1.5} mt={20} ta={"center"} c="main" fw={700}>
          Abhay Shukla
        </Text>
        <Text fz={20} lh={1.5} mt={5} ta={"center"} c="white">
          {contact.map((item) => {
            const isEmail = item.link.includes("@");
            const formattedLink = isEmail ? `mailto:${item.link}` : item.link;

            return formattedLink;
          })}
        </Text>
      </>
    );
  }
}
