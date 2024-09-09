import { Card, List, Text } from "@mantine/core";
import { GHStatsData } from "../../utils/types";
import CardTitle from "./CardTitle";

export default function GHCard({ ghStats }: { ghStats: GHStatsData }) {
  const {
    creationDate,
    lastUpdated,
    contributions,
    linesModified,
    significantRepos,
  } = ghStats;

  return (
    <Card padding="15" radius="md" c="white" mb={15}>
      <CardTitle
        title={`As of ${lastUpdated}, I've used Github to create:`}
        timeframe={""}
      />

      <Text fz={{ base: 12, sm: 16 }} mb={10}>
        {contributions} contributions, {linesModified} lines of code
        (modifications).
      </Text>

      {/* PUT THIS STUFF IN A SEPERATE COMPONENT, MAYBE ANOTHER GRID LIKE SKILLS? */}
      <Text fz={{ base: 12, sm: 16 }} mb={0}>
        Significant repositories I've made contributions in:
      </Text>
      <List>
        {significantRepos.map((repoInfo) => (
          <List.Item key={repoInfo.repo}>
            <Text fz={{ base: 12, sm: 16 }}>
              <a
                href={repoInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#7777e9",
                  textDecoration: "underline",
                }}
              >
                {repoInfo.repo}:
              </a>{" "}
              {repoInfo.description}
            </Text>
          </List.Item>
        ))}
      </List>
    </Card>
  );
}
