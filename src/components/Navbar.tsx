import {
  Box,
  Burger,
  Button,
  Group,
  Image,
  Progress,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import mainPhoto from "../static/main_photo.jpg";
import { scrollViewportTo } from "../utils/scroll";
import { useScrollContext } from "../utils/scrollContext";
import { NavItem, ScrollInfo } from "../utils/types";

const navItems: NavItem[] = [
  { label: "Home", position: "landingPosition", focused: "isLandingFocused" },
  { label: "Skills", position: "skillsPosition", focused: "isSkillsFocused" },
  {
    label: "Experience",
    position: "experiencePosition",
    focused: "isExperienceFocused",
  },
  {
    label: "Contact",
    position: "contactPosition",
    focused: "isContactFocused",
  },
];

export function Navbar() {
  const theme = useMantineTheme();
  const { scrollInformation, scrollProgress, setScrollProgress } =
    useScrollContext();
  const [isVisible, setIsVisible] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const newProgress = (window.scrollY / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));
      setIsVisible(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  const handleNavClick = (position: Extract<keyof ScrollInfo, string>) => {
    const scrollPosition = scrollInformation[position];
    if (typeof scrollPosition === "number") {
      scrollViewportTo(scrollPosition);
      if (opened) {
        toggle();
      }
    } else {
      console.error(`Invalid scroll position for ${position}`);
    }
  };

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
        bg="dark.6"
        style={{ height: "5px" }}
      />
      <Box bg="dark.6">
        <Group
          p={5}
          align="center"
          justify="space-between"
          style={{
            paddingBottom: 10,
            borderBottom: opened
              ? undefined
              : `2px solid ${theme.colors.dark[5]}`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <Group
            gap="xs"
            onClick={() => handleNavClick("landingPosition")}
            style={{ cursor: "pointer", paddingLeft: 8 }}
          >
            <Image src={mainPhoto} alt="Logo" width={32} height={32} />
            <Text fz="15" style={{ fontWeight: "bold" }}>
              Abhay Shukla
            </Text>
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="xs"
            size="sm"
            transitionDuration={250}
            mt={-3}
          />

          <Group gap={5} visibleFrom="xs">
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item.position)}
                variant="subtle"
                color={scrollInformation[item.focused] ? "main.3" : undefined}
              >
                {item.label}
              </Button>
            ))}
          </Group>
        </Group>
        {opened && (
          <Stack gap={0} hiddenFrom="xs">
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item.position)}
                variant="subtle"
                color={scrollInformation[item.focused] ? "main.3" : undefined}
                fullWidth
                style={{
                  backgroundColor: scrollInformation[item.focused]
                    ? theme.colors.dark[5]
                    : undefined,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </div>
  );
}
