import { Card, List, Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";
import { GHData } from "../../utils/types";

export default function GHCard({ ghData }: { ghData: GHData }) {
  const { lastUpdated, contributions, linesModified, significantRepos } =
    ghData;

  const statTitleBreakpoint = isSmallScreen ? <br /> : ", ";

  return (
    <Card padding="15" radius="md" c="white" mb={15}>
      <Text
        fz={{ base: 16, sm: 20 }}
        lh={1.5}
        mt={-5}
        mb={5}
        display={{ base: "block", sm: "inline" }}
      >
        <Text span c="main" fw={700} inherit>
          {contributions}
        </Text>{" "}
        Contributions
        {statTitleBreakpoint}
        <Text span c="main" fw={700} inherit>
          {linesModified}
        </Text>{" "}
        Lines Modified
      </Text>

      <Text fz={{ base: 12, sm: 16 }} mb={0}>
        Significant contributions:
      </Text>

      <List mr={15}>
        {significantRepos.map((repoInfo) => (
          <List.Item key={repoInfo.repo}>
            <Text fz={{ base: 12, sm: 14 }}>
              <a
                href={repoInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#8a8ae6",
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
