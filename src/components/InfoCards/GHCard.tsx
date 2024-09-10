import { Card, List, Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";
import { GHData } from "../../utils/types";
import CountingAnimationLabel from "./CountingAnimationLabel";

export default function GHCard({ ghData }: { ghData: GHData }) {
  const { lastUpdated, contributions, linesModified, significantRepos } =
    ghData;

  return (
    <Card padding="15" radius="md" c="white" mb={15}>
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 5,
          marginBottom: 5,
        }}
      >
        <CountingAnimationLabel
          counterAnimationInfo={[
            { label: "Contributions", finalValue: contributions },
            { label: "Lines Modified", finalValue: linesModified },
          ]}
        />
      </div>

      <Text fz={{ base: 12, sm: 16 }} mb={-2}>
        Significant contributions:
      </Text>

      <List mr={15} withPadding>
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
