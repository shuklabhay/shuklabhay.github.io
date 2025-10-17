import { Stack, Text } from "@mantine/core";
import { memo } from "react";
import ActivityCard from "../components/ActivityCard";
import AwardCard from "../components/AwardCard";
import ProjectCard from "../components/ProjectCard";
import { useAppContext } from "../utils/appContext";

function Experience() {
  const { siteData } = useAppContext();

  if (siteData) {
    const awards = siteData.awards;
    const activities = siteData.activities;
    const projects = siteData.projects;

    return (
      <Stack gap={12}>
        <Stack gap={4}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.3}>
            Some of my{" "}
            <Text span c="main" fw={700} inherit>
              significant experience:
            </Text>{" "}
          </Text>
        </Stack>

        <Stack gap={16} px={5}>
          <Stack gap={16}>
            <Text fz={{ base: 16, sm: 20 }} lh={1.3} c="main" fw={600}>
              Activities:
            </Text>
            <Stack gap={12}>
              {activities.map((activity) => {
                if (!activity.hideOnSite) {
                  return (
                    <ActivityCard
                      activityInfo={activity}
                      key={activity.position}
                    />
                  );
                }
              })}
            </Stack>
          </Stack>

          <Stack gap={16}>
            <Text fz={{ base: 16, sm: 20 }} lh={1.3} c="main" fw={600}>
              Projects:
            </Text>
            <Stack gap={12}>
              {projects.map((project) => {
                if (!project.hideOnSite) {
                  return (
                    <ProjectCard projectInfo={project} key={project.title} />
                  );
                }
              })}
            </Stack>
          </Stack>

          <Stack gap={16}>
            <Text fz={{ base: 16, sm: 20 }} lh={1.3} c="main" fw={600}>
              Awards:
            </Text>
            <Stack gap={12}>
              {awards.map((award) => {
                if (!award.hideOnSite) {
                  return <AwardCard awardInfo={award} key={award.title} />;
                }
              })}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
}

export default memo(Experience);
