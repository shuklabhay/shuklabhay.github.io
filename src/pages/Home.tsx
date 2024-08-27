import { Button, Text, Progress } from "@mantine/core";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(scrollProgress);

  return (
    <>
      <Navbar />
      <Progress
        value={scrollProgress}
        size="xl"
        radius="xl"
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          height: "90vh",
          zIndex: 1000,
        }}
      />
      <Text>Home Page!</Text>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
      <Text>iiiii</Text>
      <Button>This is button</Button>
    </>
  );
}
