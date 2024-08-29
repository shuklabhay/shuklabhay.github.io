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
          position: "relative",
          height: "100vh",
        }}
      >
        <HomeBackground />

        <Stack
          align="center"
          gap={2}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: window.matchMedia("(max-width: 767px)").matches
              ? "95vh"
              : "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            fz="54"
            style={{
              mixBlendMode: "overlay",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            Abhay Shukla
          </Text>

          <Text
            fz="18"
            style={{
              textAlign: "center",
              width: "65%",
              mixBlendMode: "luminosity",
              userSelect: "none",
            }}
          >
            High School Student, AI Researcher, Roboticist, Digital Audio
            Producer, Full Stack Developer, Nonprofit Founder, Speaker, Debater,
            Entrepreneur, and Multilingual
          </Text>
        </Stack>
      </Stack>
    );
  }
}
