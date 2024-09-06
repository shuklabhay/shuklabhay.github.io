import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "./utils/theme.ts";

import { Navbar } from "./components/Navbar.tsx";
import PageStack from "./pages/PageStack.tsx";
import { ScrollProvider } from "./utils/scrollContext.tsx";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ScrollProvider>
        <Navbar />
        <PageStack />
      </ScrollProvider>
    </MantineProvider>
  );
}
