import { Stack, Text } from "@mantine/core";
import ProjectPopup from "../components/ProjectPopup";

export default function Projects({
  isMobile,
  isSafari,
}: {
  isMobile: boolean;
  isSafari: boolean;
}) {
  return (
    <>
      <div style={{ paddingBlock: 10 }}>
        <Text fz={isMobile ? "18" : "24"} lh={1.5}>
          Here's a curated list of{" "}
          <Text span c="main" inherit style={{ fontWeight: "bold" }}>
            my favorite things I've been a part of,
          </Text>{" "}
          whether it be acomplishments or creations.
        </Text>
      </div>

      <Stack gap={12}>
        <Text fz="h5">
          [TODO: Put the gh stats here? Commits, lines written- probably make
          script to fetch gh stats and run in workflow and write stats to json]
        </Text>
        <ProjectPopup />
        <ProjectPopup />
        <ProjectPopup />
        <ProjectPopup />
        <ProjectPopup />
        <ProjectPopup />
      </Stack>
    </>
  );
}
