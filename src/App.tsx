import "@mantine/core/styles.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./utils/theme.ts";
import { BrowserRouter } from "react-router-dom";

import PageStack from "./pages/PageStack.tsx";
import { Navbar } from "./components/Navbar.tsx";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <BrowserRouter>
        <Navbar />
        <Container size="sx">
          <PageStack />
        </Container>
      </BrowserRouter>
    </MantineProvider>
  );
}
