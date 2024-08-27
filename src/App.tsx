import "@mantine/core/styles.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { SiteNavbar } from "./components/SiteNavbar";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Container size="sx">
        <BrowserRouter>
          <SiteNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </MantineProvider>
  );
}
