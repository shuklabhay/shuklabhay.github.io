import { Button, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import loadProjectsData from "../utils/data";
import { SiteData } from "../utils/types";

export default function Qualifications() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadProjectsData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 16, sm: 24 }} lh={1.5}>
            I've also worked with a{" "}
            <Text span c="main" fw={700} inherit>
              LOT
            </Text>{" "}
            of different tools.
          </Text>
        </div>

        <Button h={850}></Button>

        <Text fz={{ base: 16, sm: 18 }}>
          GitHub: {siteData.ghStats.contributions} Contributions,{" "}
          {siteData.ghStats.linesModified} Lines modified, [profile link]
        </Text>
      </>
    );
  }
}
