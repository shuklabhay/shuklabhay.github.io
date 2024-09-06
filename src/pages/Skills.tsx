import { Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
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

    return (
      <>
        <div style={{ paddingBlock: 10 }}>
          <Text fz={{ base: 16, sm: 24 }} lh={1.5}>
            I've worked with a{" "}
            <Text span c="main" fw={700} inherit>
              LOT
            </Text>{" "}
            of different tools.
          </Text>
        </div>

        <Button h={850}></Button>

        <Text fz={{ base: 16, sm: 18 }}>
          GitHub: {ghStats.contributions} Contributions, {ghStats.linesModified}{" "}
          Lines modified, [profile link]
        </Text>
      </>
    );
  }
}
