import { Button, Stack, Text } from "@mantine/core";
import ProjectPopup from "../components/ProjectPopup";

export default function Projects() {
  return (
    <>
      <div style={{ paddingBottom: 10 }}>
        <Text fz="h1">Welcome to my world of things</Text>
        <Text fz="h4" mt={-5}>
          Who I am is best defined by what I've done, things I've acomplished
          and things I've created.
        </Text>
      </div>

      <Stack gap={12}>
        <Text fz="h4">
          Maybe put the gh stats here? Commits, lines written, list of cool
          repos i have commits in
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
