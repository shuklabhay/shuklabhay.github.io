import { Stack, Text } from "@mantine/core";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";
import loadSiteData from "../utils/staticdata";

export default function Projects({ isMobile }: { isMobile: boolean }) {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadSiteData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
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
          <ProjectCard />
          <ProjectCard />
        </Stack>

        <Text fz={{ base: 16, sm: 18 }}>
          GitHub: {siteData.ghStats.contributions} Contributions,{" "}
          {siteData.ghStats.linesModified} Lines modified, [profile]
        </Text>
      </>
    );
  }
}
