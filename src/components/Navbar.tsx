import {
  Container,
  Group,
  Burger,
  Button,
  Image,
  Text,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import mainPhoto from "../static/main_photo.jpg";

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Container
      size="sx"
      px={0}
      py={10}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
        <Button onClick={() => handleNavigation("/projects")} variant="subtle">
          Projects
        </Button>
        <Button onClick={() => handleNavigation("/contact")} variant="subtle">
          Contact
        </Button>
      </Group>
      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
    </Container>
  );
}
