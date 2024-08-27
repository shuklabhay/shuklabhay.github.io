import "@mantine/core/styles.css";
import { Button, MantineProvider } from "@mantine/core";
import ReactDOM from "react-dom/client";
import React from "react";
import { createTheme } from "@mantine/core";



export const theme = createTheme({
  primaryColor: mainColor,
  colors: {
    mainColor = 
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Button> hiii</Button>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
