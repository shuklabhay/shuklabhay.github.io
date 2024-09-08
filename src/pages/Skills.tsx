import { Grid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import SkillCard from "../components/InfoCards/SkillCard";
import loadSiteData from "../utils/data";
import { SiteData } from "../utils/types";

export default function Skills() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadSiteData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const ghStats = siteData.ghStats;
    const skills = siteData.skills;

    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.5}>
            I have experience in a{" "}
            <Text span c="main" fw={700} inherit>
              LOT
            </Text>{" "}
            of different areas.
          </Text>
        </div>

        <Grid justify="center" gutter="sm" mb={15}>
          {skills.map((skill) => (
            <Grid.Col span={{ base: 4, sm: 2 }} key={skill.skill}>
              <SkillCard skillInfo={skill} />
            </Grid.Col>
          ))}
        </Grid>

        <Text fz={{ base: 16, sm: 18 }}>
          GitHub: {ghStats.contributions} Contributions, {ghStats.linesModified}{" "}
          Lines modified, [profile link]
        </Text>
      </>
    );
  }
}
