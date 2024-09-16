import { Grid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import ContactCard from "../components/InfoCards/ContactCard";
import { SiteData } from "../utils/types";
import useSiteData from "../utils/useSiteData";

export default function Contact() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await useSiteData();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const contact = siteData.contact;

    return (
      <div style={{ paddingBlock: 10 }}>
        <div style={{ paddingBlock: 10, marginBottom: -10 }}>
          <Text fz={{ base: 18, sm: 24 }} lh={1.5} mt={-10}>
            <Text span c="main" fw={700} inherit>
              Reach out
            </Text>{" "}
            anywhere here:
          </Text>
        </div>

        <Grid gutter="sm">
          {contact.map((contactItem) => {
            return (
              <Grid.Col
                span={{ base: 12, sm: 6 }}
                mb={-15}
                key={contactItem.title}
              >
                <ContactCard contactItem={contactItem} />
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    );
  }
}
