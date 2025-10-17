import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "./utils/theme.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InteractiveSite from "./pages/InteractiveSite.tsx";
import PlainTextSite from "./pages/PlainTextSite.tsx";
import { AppProvider } from "./utils/appContext.tsx";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<InteractiveSite />} />
            <Route path="/plaintext" element={<PlainTextSite />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </MantineProvider>
  );
}
