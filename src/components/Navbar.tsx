import {
  Group,
  Burger,
  Button,
  Image,
  Text,
  useMantineTheme,
  Progress,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import mainPhoto from "../static/main_photo.jpg";
import { useEffect, useState } from "react";
import { useScrollContext } from "../utils/scrollContext";
import { scrollViewportTo } from "../utils/scrolling";

export function Navbar() {
  const { scrollInformation, scrollProgress, setScrollProgress } =
    useScrollContext();
  const [isVisible, setIsVisible] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const newProgress = (window.scrollY / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));

      // Show/hide navbar
      setIsVisible(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  console.log(scrollProgress);

  if (theme.colors.main) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          transform: `translateY(${isVisible ? "0" : "-100%"})`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <Progress
          value={scrollProgress}
          radius={0}
          animated={false}
          transitionDuration={200}
          style={{ height: "5px", backgroundColor: theme.colors.dark[6] }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingInline: 10,
            paddingBlock: 6,
            paddingBottom: 7,
            backgroundColor: theme.colors.dark[6],
          }}
        >
          <Button
            onClick={() => scrollViewportTo(scrollInformation.landingPosition)}
            variant="subtle"
            style={{ width: "187px" }}
          >
            <Group gap="xs">
              <Image src={mainPhoto} alt="Logo" width={32} height={32} />
              <Text fz="h5" style={{ fontWeight: "bold" }}>
                Abhay Shukla
              </Text>
            </Group>
          </Button>
          <Group gap={5} visibleFrom="xs">
            <Button
              onClick={() =>
                scrollViewportTo(scrollInformation.landingPosition)
              }
              variant="subtle"
              color={
                scrollInformation.isLandingFocused
                  ? theme.colors.main[3]
                  : undefined
              }
            >
              Home
            </Button>
            <Button
              onClick={() =>
                scrollViewportTo(scrollInformation.projectsPosition)
              }
              variant="subtle"
              color={
                scrollInformation.isProjectsFocused
                  ? theme.colors.main[3]
                  : undefined
              }
            >
              Projects
            </Button>
            <Button
              onClick={() =>
                scrollViewportTo(scrollInformation.contactPosition)
              }
              variant="subtle"
              color={
                scrollInformation.isContactFocused
                  ? theme.colors.main[3]
                  : undefined
              }
            >
              Contact
            </Button>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </div>
      </div>
    );
  }
}
