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

export function Navbar() {
  const { scrollInformation } = useScrollContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Modify scroll progress bar
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableDistance = documentHeight - windowHeight;

      const newProgress = (scrollTop / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (scrollPosittion: number) => {
    window.scrollTo({
      top: scrollPosittion,
      behavior: "smooth",
    });
  };

  if (theme.colors.main) {
    return (
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
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
            onClick={() => scrollTo(scrollInformation.landingPosition)}
            variant="subtle"
            style={{ paddingInline: 6 }}
          >
            <Group gap="xs">
              <Image src={mainPhoto} alt="Logo" width={32} height={32} />
              <Text fz="h5">Abhay Shukla</Text>
            </Group>
          </Button>

          <Group gap={5} visibleFrom="xs">
            <Button
              onClick={() => scrollTo(scrollInformation.landingPosition)}
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
              onClick={() => scrollTo(scrollInformation.projectsPosition)}
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
              onClick={() => scrollTo(scrollInformation.contactPosition)}
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
