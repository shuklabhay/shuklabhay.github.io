import { Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import AwardCard from "../components/InfoCards/AwardCard";
import PositionCard from "../components/InfoCards/PositionCard";
import ProjectCard from "../components/InfoCards/ProjectCard";
import loadSiteData from "../utils/data";
import { SiteData } from "../utils/types";

export default function Acomplishments() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadSiteData();
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
          <Text fz={{ base: 16, sm: 24 }} lh={1.5}>
            Here's a curated list of{" "}
            <Text span c="main" fw={700} inherit>
              my favorite things I've been a part of:
            </Text>{" "}
          </Text>
        </div>

        <Stack gap={12}>
          <Text fz={{ base: 14, sm: 20 }} lh={1.5}>
            Projects:
          </Text>
          {projects.map((project) => {
            return <ProjectCard projectInfo={project} />;
          })}
          <Text fz={{ base: 14, sm: 20 }} lh={1.5}>
            Positions and Programs:
            {positions.map((position) => {
              return <PositionCard positionInfo={position} />;
            })}
          </Text>
          <Text fz={{ base: 14, sm: 20 }} lh={1.5}>
            Awards:
          </Text>
          {awards.map((award) => {
            return <AwardCard awardInfo={award} />;
          })}
        </Stack>
      </>
    );
  }
}
