import { ActionIcon } from "@mantine/core";

export const LeftArrowIcon = ({ large = true }: { large: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={large ? "24" : "20"}
      height={large ? "24" : "20"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </svg>
  );
};

export const RightArrowIcon = ({ large = true }: { large: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={large ? "24" : "20"}
      height={large ? "24" : "20"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M13 18l6 -6" />
      <path d="M13 6l6 6" />
    </svg>
  );
};

export default function LRArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <ActionIcon
      radius="xl"
      size={40}
      onClick={onClick}
      ml={direction == "left" ? 10 : 0}
      mr={direction == "right" ? 10 : 0}
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 200,
      }}
    >
      {direction == "left" && <LeftArrowIcon large={true} />}
      {direction == "right" && <RightArrowIcon large={true} />}
    </ActionIcon>
  );
}
