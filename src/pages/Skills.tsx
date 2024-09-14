import { Grid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import GHCard from "../components/InfoCards/GHCard";
import SkillCard from "../components/InfoCards/SkillCard";
import { SiteData } from "../utils/types";
import useSiteData from "../utils/useData";

export default function Skills() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await useSiteData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const ghData = siteData.ghData;
    const skills = siteData.skills;

    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.5}>
            I've worked in a{" "}
            <Text span c="main" fw={700} inherit>
              variety
            </Text>{" "}
            of technical fields:
          </Text>
        </div>

        <Stack gap={0}>
          <Grid justify="center" gutter="sm" mb={10}>
            {skills.map((skill) => (
              <Grid.Col span={{ base: 4, sm: 2 }} key={skill.skill}>
                <SkillCard skillInfo={skill} />
              </Grid.Col>
            ))}
          </Grid>

          <Grid gutter="sm" mb={0}>
            <Grid.Col span={{ base: 4, sm: 2 }}>
              <SkillCard skillInfo={{ skill: "Git:" }} />
            </Grid.Col>
            <Grid.Col span={{ base: 8, sm: 10 }}>
              <GHCard ghData={ghData} />
            </Grid.Col>
          </Grid>

          <Text fz={{ base: 10, sm: 12 }} mt={-10} ta={"right"}>
            (Github Data last updated {ghData.lastUpdated})
          </Text>
        </Stack>
      </>
    );
  }
}
