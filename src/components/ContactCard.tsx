import { Card, Button } from "@mantine/core";
import React from "react";
import { ContactItem } from "../utils/types";

export default function ContactCard({
  contactItem,
}: {
  contactItem: ContactItem;
}) {
  const { title, link } = contactItem;

  const isEmail = link.includes("@");
  const formattedLink = isEmail ? `mailto:${link}` : link;

  return (
    <Button
      component="a"
      href={formattedLink}
      target="_blank"
      rel="noopener noreferrer"
      fullWidth
      color="main.4"
    >
      {title}
    </Button>
  );
}
