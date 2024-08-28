import { Stack, Text, useMantineTheme } from "@mantine/core";
import { HomeBackground } from "../components/HomeBackground";

export default function Home() {
  const theme = useMantineTheme();

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{
          paddingTop: "17%",
          position: "relative",
          height: "100vh",
        }}
      >
        <HomeBackground />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        <Text fz="h1" style={{ mixBlendMode: "overlay", userSelect: "none" }}>
          Abhay Shukla
        </Text>

        <Text
          fz="h5"
          style={{
            textAlign: "center",
            width: "65%",
            mixBlendMode: "soft-light",
            userSelect: "none",
          }}
        >
          High School Student, AI Researcher, Roboticist, Digital Audio
          Producer, Full Stack Developer, Nonprofit Founder, Speaker, Debator,
          Entrepreneur, and Multilingual
        </Text>
      </Stack>
    );
  }
}
