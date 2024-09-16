import { Card, Text } from "@mantine/core";
import { ContactItem } from "../../utils/types";

export default function ContactCard({
  contactItem,
}: {
  contactItem: ContactItem;
}) {
  const { title, link } = contactItem;

  return (
    <Card padding="15" radius="md" c="white" mb={15}>
      <Text fz={{ base: 12, sm: 16 }} mb={-2}>
        Significant contributions:
      </Text>
    </Card>
  );
}
