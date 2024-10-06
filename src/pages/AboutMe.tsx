import { Card, Grid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard";
import { getJSONDataForSite } from "../utils/data";
import { SiteData } from "../utils/types";

export default function AboutMe() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await getJSONDataForSite();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const contact = siteData.contact;
    const education = siteData.education;

    return (
      <div style={{ paddingBlock: 10 }}>
        <div style={{ paddingBlock: 10, marginBottom: -10 }}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.5} mt={-10} mb={10}>
            Hi! My name is Abhay Shukla, I'm a{" "}
            <Text span c="main" fw={700} inherit>
              {education[0]?.degree}
            </Text>{" "}
            at{" "}
            <Text span c="main" fw={700} inherit>
              {education[0]?.school}
            </Text>{" "}
            who's really passionate about AI and Robotics. Let's get in touch!
          </Text>
        </div>

        <Grid gutter="sm">
          {contact.map((contactItem) => {
            return (
              <Grid.Col span={{ base: 12, sm: 6 }} key={contactItem.title}>
                <ContactCard contactItem={contactItem} />
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    );
  }
}
