import { Button, Stack, Text, useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";

export default function Home() {
  const theme = useMantineTheme();

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{ height: "95vh", paddingTop: "15%" }}
      >
        <motion.div
          whileHover={{
            scale: 1.3,
            color: theme.colors.main[3],
          }}
          transition={{ duration: 0.4 }}
        >
          <Text fz="h1">Abhay Shukla</Text>
        </motion.div>

        <Text fz="body2" style={{ textAlign: "center", width: "65%" }}>
          High School Student, AI Researcher, Roboticist, Audio Engineer, Full
          Stack Developer, Nonprofit Founder, Speaker, Debator, Entrepreneur,
          and Multilingual
        </Text>
      </Stack>
    );
  }
}
