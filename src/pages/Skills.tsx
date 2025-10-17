import { Grid, Stack, Text } from "@mantine/core";
import { memo } from "react";
import GHCard from "../components/CardComponents/GHCard";
import SkillCard from "../components/SkillCard";
import { useAppContext } from "../utils/appContext";

function Skills() {
  const { siteData } = useAppContext();

  if (siteData) {
    const ghData = siteData.ghData;
    const { technical, other } = siteData.skills;

    const allSkills = technical.concat(other);

    return (
      <Stack gap={12}>
        <Stack gap={4}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.3}>
            I've worked in{" "}
            <Text span c="main" fw={700} inherit>
              various different fields:
            </Text>{" "}
          </Text>
        </Stack>

        <Stack gap={16}>
          <Grid justify="center" gutter="sm">
            {allSkills.map((skill) => (
              <Grid.Col span={{ base: 4, sm: 2 }} key={skill}>
                <SkillCard skill={skill} />
              </Grid.Col>
            ))}
          </Grid>

          <Grid gutter="sm">
            <Grid.Col span={{ base: 4, sm: 2 }}>
              <SkillCard skill={"Git: "} />
            </Grid.Col>
            <Grid.Col span={{ base: 8, sm: 10 }}>
              <GHCard ghData={ghData} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    );
  }
}

export default memo(Skills);
