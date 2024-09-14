import { Text } from "@mantine/core";

export default function Contact() {
  return (
    <>
      <div style={{ paddingBlock: 10 }}>
        <Text fz={{ base: 18, sm: 24 }} lh={1.5}>
          You can{" "}
          <Text span c="main" fw={700} inherit>
            find me
          </Text>{" "}
          somewhere here:
        </Text>
      </div>

      <Text>Contact info here</Text>
      <Text>Email: abhayshuklavtr@gmail.com</Text>
    </>
  );
}
