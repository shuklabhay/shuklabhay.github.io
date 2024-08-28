import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./utils/theme.ts";

import PageStack from "./pages/PageStack.tsx";
import { Navbar } from "./components/Navbar.tsx";
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
