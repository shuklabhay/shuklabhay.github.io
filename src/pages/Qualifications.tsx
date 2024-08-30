import { Button, Text } from "@mantine/core";

export default function Qualifications() {
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
