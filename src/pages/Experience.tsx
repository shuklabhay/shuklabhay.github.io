import { Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import AwardCard from "../components/InfoCards/AwardCard";
import PositionCard from "../components/InfoCards/PositionCard";
import ProjectCard from "../components/InfoCards/ProjectCard";
import { SiteData } from "../utils/types";
import useSiteData from "../utils/useSiteData";

export default function Experience() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await useSiteData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const awards = siteData.awards;
    const positions = siteData.positions;
    const projects = siteData.projects;

    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.5} mb={-5}>
            Some of my{" "}
            <Text span c="main" fw={700} inherit>
              significant experience:
            </Text>{" "}
          </Text>
        </div>

        <Stack gap={12} px={5}>
          <Text fz={{ base: 14, sm: 20 }} lh={0.5} pt={5}>
            Positions and Programs:
          </Text>
          {positions.map((position) => {
            return (
              <PositionCard positionInfo={position} key={position.position} />
            );
          })}

          <Text fz={{ base: 14, sm: 20 }} lh={0.5} pt={5}>
            Projects:
          </Text>
          {projects.map((project) => {
            return <ProjectCard projectInfo={project} key={project.title} />;
          })}

          <Text fz={{ base: 14, sm: 20 }} lh={0.5} pt={5}>
            Awards:
          </Text>
          {awards.map((award) => {
            if (!award.hide) {
              return <AwardCard awardInfo={award} key={award.title} />;
            }
          })}
        </Stack>
      </>
    );
  }
}
