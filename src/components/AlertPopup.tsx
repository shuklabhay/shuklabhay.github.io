import { Alert } from "@mantine/core";
import { useEffect, useState } from "react";

export function AlertPopup() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Alert
      title="Limited Animation Support"
      color="yellow"
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: 300,
      }}
    >
      Full animation is only supported on non-Safari desktop browsers.
    </Alert>
  );
}
