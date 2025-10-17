import { Card, Grid, Stack, Text } from "@mantine/core";
import { memo } from "react";
import BulletPointList from "../components/CardComponents/BulletPointList";
import ContactCard from "../components/ContactCard";
import { useAppContext } from "../utils/appContext";

function AboutMe() {
  const { siteData } = useAppContext();

  if (siteData) {
    const contact = siteData.contact;
    const education = siteData.education;

    return (
      <Stack gap={12}>
        <Stack gap={4}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.3}>
            Information{" "}
            <Text span c="main" fw={700} inherit>
              about me:
            </Text>{" "}
          </Text>
        </Stack>

        <Stack gap={16} px={5}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card padding="16" radius="md" c="white">
                {education.map((education) => {
                  const Header = () => {
                    return (
                      <Text
                        fz={{ base: 16, sm: 18 }}
                        lh={1.3}
                        key={education.school}
                        mb={2}
                        fw={600}
                      >
                        <Text span inherit c="main">
                          {education.school}
                        </Text>
                        <Text span inherit c="dimmed" fz="sm" display="block">
                          {education.location}
                        </Text>
                      </Text>
                    );
                  };
                  const details = [
                    {
                      point: `${education.degree} - ${education.gpa}`,
                    },
                  ];

                  return (
                    <BulletPointList
                      key={education.school}
                      HeaderComponent={Header}
                      details={details}
                      mb={0}
                    />
                  );
                })}
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap={12}>
                {contact.map((contactItem) => {
                  return (
                    <ContactCard
                      contactItem={contactItem}
                      key={contactItem.title}
                    />
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    );
  }
}

export default memo(AboutMe);
