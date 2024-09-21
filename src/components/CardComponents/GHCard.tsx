import { Card, Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";
import { GHData } from "../../utils/types";
import CountingAnimationLabel from "./CountingAnimationLabel";

export default function GHCard({ ghData }: { ghData: GHData }) {
  const { contributions, linesModified } = ghData;

  return (
    <>
      <Card
        padding="15"
        radius="md"
        c="white"
        h={{ base: 50, sm: 65 }}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: isSmallScreen ? 5 : 0,
            marginTop: isSmallScreen ? 5 : -2,
          }}
        >
          <CountingAnimationLabel
            counterAnimationInfo={[
              { label: "Contributions", finalValue: contributions },
              { label: "Lines Modified", finalValue: linesModified },
            ]}
          />
        </div>
      </Card>
      <Text fz={{ base: 10, sm: 12 }} mt={2} ta={"right"}>
        (Github Data last updated {ghData.lastUpdated})
      </Text>
    </>
  );
}
