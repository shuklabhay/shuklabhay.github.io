import { Button, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import loadProjectsData from "../utils/data";

export default function Qualifications() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await loadProjectsData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  return (
    <>
      <div style={{ paddingBlock: 10 }}>
        <Text fz={{ base: 16, sm: 24 }} lh={1.5}>
          I've worked with a{" "}
          <Text span c="main" fw={700} inherit>
            LOT
          </Text>{" "}
          of different things.
        </Text>
      </div>

      <Button h={700}></Button>

      {/* <Text fz={{ base: 16, sm: 18 }}>
        GitHub: {siteData.ghStats.contributions} Contributions,{" "}
        {siteData.ghStats.linesModified} Lines modified, [profile]
      </Text> */}
    </>
  );
}
