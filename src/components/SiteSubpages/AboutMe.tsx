import { Grid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { SiteData } from "../../utils/types";
import { getJSONDataForSite } from "../../utils/data";
import ContactCard from "../ContactCard";
import BulletPointList from "../CardComponents/BulletPointList";

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
        <Text fz={{ base: 18, sm: 24 }} lh={1.5} mt={-10} mb={10}>
          Information{" "}
          <Text span c="main" fw={700} inherit>
            about me:
          </Text>
        </Text>

        <Stack px={5}>
          <div>
            {education.map((education) => {
              const Header = () => {
                return (
                  <Text fz={{ base: 18, sm: 20 }} key={education.school}>
                    <Text span inherit>
                      {education.school}
                    </Text>{" "}
                    ({education.location})
                  </Text>
                );
              };
              const details = [
                {
                  point: `${education.degree} - ${education.gpa}`,
                },
              ];

              return (
                <BulletPointList HeaderComponent={Header} details={details} />
              );
            })}
          </div>

          <Grid gutter="sm" mt={-5}>
            {contact.map((contactItem) => {
              return (
                <Grid.Col span={{ base: 12, sm: 6 }} key={contactItem.title}>
                  <ContactCard contactItem={contactItem} />
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </div>
    );
  }
}
