import { ActionIcon } from "@mantine/core";

export default function DownArrowButton({
  onClick,
  opacity,
}: {
  onClick: () => void;
  opacity: number;
}) {
  return (
    <ActionIcon
      radius="xl"
      size={40}
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 25,
        backgroundColor: "transparent",
        opacity: opacity,
        transition: "opacity 2.5s ease",
        zIndex: 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5l0 14" />
        <path d="M18 13l-6 6" />
        <path d="M6 13l6 6" />
      </svg>
    </ActionIcon>
  );
}
