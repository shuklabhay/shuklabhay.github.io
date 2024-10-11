import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "./utils/theme.ts";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import InteractiveSite from "./pages/InteractiveSite.tsx";
import { AppProvider } from "./utils/appContext.tsx";
import PlainTextSite from "./pages/PlainTextSite.tsx";
import { useEffect } from "react";
import ReactGA from "react-ga4";

// Route Tracking
const AnalyticsTrackingID = import.meta.env.VITE_TRACKING_ID;
ReactGA.initialize(AnalyticsTrackingID);

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      title: location.pathname,
      location: location.pathname,
    });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppProvider>
        <BrowserRouter>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<InteractiveSite />} />
            <Route path="/plaintext" element={<PlainTextSite />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </MantineProvider>
  );
}
