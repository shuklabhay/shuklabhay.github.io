import { Stack, Text } from "@mantine/core";
import ProjectPopup from "../components/ProjectPopup";

export default function Projects() {
  return (
    <>
      <div style={{ paddingBottom: 10 }}>
        <Text fz="h2" lh={1.5}>
          Welcome to my world of things
        </Text>
        <Text fz="h5">
          Here's a curated list of my favorite things I've been a part of,
          whether it be acomplishments or creations.
        </Text>
      </div>

      <Stack gap={12}>
        <Text fz="h5">
          [TODO: Put the gh stats here? Commits, lines written, list of cool
          repos I have commits in]
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
