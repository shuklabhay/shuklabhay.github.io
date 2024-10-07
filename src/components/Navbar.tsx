import {
  Box,
  Burger,
  Button,
  Group,
  Progress,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { scrollViewportTo } from "../utils/scroll";
import { useAppContext } from "../utils/appContext";
import { NavItem, ScrollInfo } from "../utils/types";
import ConfigButton from "./IconButtons/ConfigButton";

const navItems: NavItem[] = [
  { label: "Home", position: "landingPosition", focused: "isLandingFocused" },
  { label: "Skills", position: "skillsPosition", focused: "isSkillsFocused" },
  {
    label: "Experience",
    position: "experiencePosition",
    focused: "isExperienceFocused",
  },
  {
    label: "About",
    position: "aboutMePosition",
    focused: "isAboutMeFocused",
  },
];

export function Navbar() {
  const theme = useMantineTheme();
  const {
    scrollInformation: scrollInformation,
    scrollProgress,
    setScrollProgress,
  } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const newProgress = (window.scrollY / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));
      setIsVisible(window.scrollY > 30);
      if (window.scrollY < 30 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress, open]);

  const handleNavClick = (position: Extract<keyof ScrollInfo, string>) => {
    const scrollPosition = scrollInformation[position];
    if (typeof scrollPosition === "number") {
      scrollViewportTo(scrollPosition);
      if (open) {
        setOpen(false);
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
        zIndex: 20,
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
            borderBottom: open
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
            <Text fz="15" style={{ fontWeight: "bold" }}>
              Abhay Shukla
            </Text>
          </Group>

          <Group gap={0} hiddenFrom="xs" mt={-3}>
            <ConfigButton />
            <Burger
              opened={open}
              onClick={() => {
                setOpen(!open);
              }}
              size="sm"
              transitionDuration={250}
            />
          </Group>

          <Group gap={5} visibleFrom="xs" mr={5}>
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
            <ConfigButton />
          </Group>
        </Group>
        {open && (
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
