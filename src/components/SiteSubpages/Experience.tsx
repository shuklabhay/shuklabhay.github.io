import { Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import AwardCard from "../AwardCard";
import ActivityCard from "../ActivityCard";
import ProjectCard from "../ProjectCard";
import { getJSONDataForSite } from "../../utils/data";
import { SiteData } from "../../utils/types";

export default function Experience() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await getJSONDataForSite();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const awards = siteData.awards;
    const activities = siteData.activities;
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
          <Text fz={{ base: 16, sm: 20 }} lh={0.5} pt={5}>
            Activities:
          </Text>
          {activities.map((activity) => {
            if (!activity.hideOnSite) {
              return (
                <ActivityCard activityInfo={activity} key={activity.position} />
              );
            }
          })}

          <Text fz={{ base: 16, sm: 20 }} lh={0.5} pt={5}>
            Projects:
          </Text>
          {projects.map((project) => {
            if (!project.hideOnSite) {
              return <ProjectCard projectInfo={project} key={project.title} />;
            }
          })}

          <Text fz={{ base: 16, sm: 20 }} lh={0.5} pt={5}>
            Awards:
          </Text>
          {awards.map((award) => {
            if (!award.hideOnSite) {
              return <AwardCard awardInfo={award} key={award.title} />;
            }
          })}
        </Stack>
      </>
    );
  }
}
