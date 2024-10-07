import { ActionIcon, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function SwitchViewButton({
  navigateTo,
}: {
  navigateTo: "/plaintext" | "/";
}) {
  const navigate = useNavigate();

  return (
    <ActionIcon
      radius="xl"
      size={22}
      onClick={() => {
        navigate(navigateTo);
      }}
      style={{
        backgroundColor: "rgba(0,0,0,0)",
        zIndex: 200,
      }}
      c="main.1"
      mr={5}
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
        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
      </svg>
    </ActionIcon>
  );
}
