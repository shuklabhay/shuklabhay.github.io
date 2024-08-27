import { Container, Group, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function SiteNavbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header>
      <Container size="sx" style={{ paddingTop: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "60px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              cursor: "pointer",
              paddingTop: 5,
            }}
            onClick={() => handleNavigation("/")}
          >
            Logo
          </span>

          <Group gap={5} visibleFrom="xs">
            <Button onClick={() => handleNavigation("/")} variant="subtle">
              Home
            </Button>
            <Button onClick={() => handleNavigation("/about")} variant="subtle">
              About
            </Button>
            <Button
              onClick={() => handleNavigation("/contact")}
              variant="subtle"
            >
              Contact
            </Button>
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </div>
      </Container>
    </header>
  );
}
