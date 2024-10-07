import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "./utils/theme.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InteractiveSite from "./pages/InteractiveSite.tsx";
import { AppProvider } from "./utils/appContext.tsx";
import PlainTextSite from "./pages/PlainTextSite.tsx";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InteractiveSite />} />
            <Route path="/plaintext" element={<PlainTextSite />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </MantineProvider>
  );
}
