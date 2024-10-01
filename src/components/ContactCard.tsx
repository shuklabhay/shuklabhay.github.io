import { Card, Text } from "@mantine/core";
import React from "react";
import { ContactItem } from "../utils/types";

export default function ContactCard({
  contactItem,
}: {
  contactItem: ContactItem;
}) {
  const { title, link } = contactItem;

  return (
    <Card padding="15" radius="md" c="white" mb={15}>
      <Text fz={{ base: 12, sm: 16 }} mb={-2}>
        {title}:{" "}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#8a8ae6",
            textDecoration: "underline",
          }}
        >
          {link}
        </a>
      </Text>
    </Card>
  );
}
