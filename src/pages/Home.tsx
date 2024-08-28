import { Stack, Text, useMantineTheme } from "@mantine/core";
import { HomeBackground } from "../components/HomeBackground";

export default function Home() {
  const theme = useMantineTheme();

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{ paddingTop: "17%", position: "relative", height: "100vh" }}
      >
        <HomeBackground />
        <Text fz="h1">Abhay Shukla</Text>

        <Text fz="h5" style={{ textAlign: "center", width: "65%" }}>
          High School Student, AI Researcher, Roboticist, Audio Engineer, Full
          Stack Developer, Nonprofit Founder, Speaker, Debator, Entrepreneur,
          and Multilingual
        </Text>
      </Stack>
    );
  }
}
