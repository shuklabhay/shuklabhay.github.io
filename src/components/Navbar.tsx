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
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <Progress value={scrollProgress} radius={0} style={{ height: "5px" }} />

      <Container
        size="sx"
        px={0}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "10vh",
          backgroundColor: theme.colors.dark[6],
        }}
      >
        <Group
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigation("/")}
        >
          <Image src={mainPhoto} alt="Logo" width={40} height={40} />
          <Text fz="h4">Abhay Shukla</Text>
        </Group>

        <Group gap={5} visibleFrom="xs">
          <Button onClick={() => handleNavigation("/")} variant="subtle">
            Home
          </Button>
          <Button
            onClick={() => handleNavigation("/projects")}
            variant="subtle"
          >
            Projects
          </Button>
          <Button onClick={() => handleNavigation("/contact")} variant="subtle">
            Contact
          </Button>
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        {/* make burger not have the animation, make it have like screen overlay with options or wtv */}
      </Container>
    </div>
  );
}
