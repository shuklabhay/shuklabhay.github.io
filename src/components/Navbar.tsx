import {
  Container,
  Group,
  Burger,
  Button,
  Image,
  Text,
  useMantineTheme,
  Progress,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import mainPhoto from "../static/main_photo.jpg";
import { useEffect, useState } from "react";

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  const theme = useMantineTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const newProgress =
        (document.documentElement.scrollTop / totalHeight) * 100;
      setScrollProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(scrollProgress);

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
          onClick={() => {}}
          variant="subtle"
          style={{ paddingInline: 6 }}
        >
          <Group gap="xs">
            <Image src={mainPhoto} alt="Logo" width={32} height={32} />
            <Text fz="h4">Abhay Shukla</Text>
          </Group>
        </Button>

        <Group gap={5} visibleFrom="xs">
          <Button onClick={() => {}} variant="subtle">
            Home
          </Button>
          <Button onClick={() => {}} variant="subtle">
            Projects
          </Button>
          <Button onClick={() => {}} variant="subtle">
            Contact
          </Button>
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        {/* make burger not have the animation, make it have like screen overlay with options or wtv */}
      </div>
    </div>
  );
}
