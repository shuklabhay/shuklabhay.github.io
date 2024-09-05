import { Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import loadProjectsData from "../utils/data";
import { SiteData } from "../utils/types";

export default function Projects() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadProjectsData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const awards = siteData.awards;
    const projects = siteData.projects;

    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 16, sm: 24 }} lh={1.5}>
            Here's a curated list of{" "}
            <Text span c="main" fw={700} inherit>
              my favorite things I've been a part of,
            </Text>{" "}
            whether it be acomplishments or creations.
          </Text>
        </div>

        <Stack gap={12}>
          {projects.map((project) => {
            return <ProjectCard projectInfo={project} />;
          })}
        </Stack>
      </>
    );
  }
}
