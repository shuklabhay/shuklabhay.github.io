import { Container, Stack, Text } from "@mantine/core";
import { getJSONDataForSite } from "../utils/data";
import { useEffect, useState } from "react";
import { SiteData, ActivityItem, ProjectItem } from "../utils/types";
import HoverHighlightText from "../components/HoverHighlightText";
import { getTimeframeLabel } from "../utils/dates";
import BulletPointList from "../components/CardComponents/BulletPointList";

const ActivityDescription = ({
  activityInfo,
}: {
  activityInfo: ActivityItem;
}) => {
  const { org, position, startYear, endYear, ongoing, details, icon } =
    activityInfo;

  const timeframeLabel = getTimeframeLabel(startYear, endYear, ongoing, true);

  const Header = () => {
    return (
      <Text fz={16} lh={1.5} mb={-15}>
        <HoverHighlightText
          link={icon.link}
          text={`(${timeframeLabel}) ${org}`}
          size={"inherit"}
          shade="light"
        />{" "}
        |{" "}
        <Text span c="main.3" fw={700} inherit>
          {position}
        </Text>{" "}
      </Text>
    );
  };

  return <BulletPointList HeaderComponent={Header} details={details} />;
};

const ProjectDescription = ({ projectInfo }: { projectInfo: ProjectItem }) => {
  const { title, broadDescription, details, images, link } = projectInfo;

  const Header = () => {
    return (
      <Text fz={16} lh={1.5} mb={-15}>
        <HoverHighlightText
          link={link[0].url}
          text={title}
          size={"inherit"}
          shade="light"
        />{" "}
        | {broadDescription}
      </Text>
    );
  };

  return <BulletPointList HeaderComponent={Header} details={details} />;
};

export default function PlainTextSite() {
  const [siteData, setSiteData] = useState<SiteData>();

  useEffect(() => {
    async function fetchData() {
      const newSiteData = await getJSONDataForSite();
      setSiteData(newSiteData);
    }
    fetchData();
  }, []);

  if (siteData) {
    const activities = siteData.activities;
    const awards = siteData.awards;
    const contact = siteData.contact;
    const education = siteData.education;
    const projects = siteData.projects;
    const skills = siteData.skills;

    return (
      <Container>
        <div>
          <Text fz={26} lh={1.5} mt={10} ta={"center"} c="main" fw={700}>
            Abhay Shukla
          </Text>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {contact.map((item) => {
              const isEmail = item.link.includes("@");
              const formattedLink = isEmail ? `mailto:${item.link}` : item.link;

              return (
                <div key={item.title} style={{ margin: 20, marginTop: 10 }}>
                  <HoverHighlightText
                    text={item.title}
                    link={formattedLink}
                    size={16}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Text fz={22} lh={1.5} mt={10} ta={"left"} c="main" fw={700}>
            Experience
          </Text>

          <Stack>
            {activities.map((activity) => {
              if (!activity.hideOnResume) {
                return (
                  <ActivityDescription
                    key={activity.org}
                    activityInfo={activity}
                  />
                );
              }
            })}
          </Stack>
        </div>

        <div>
          <Text fz={22} lh={1.5} mt={10} ta={"left"} c="main" fw={700}>
            Projects
          </Text>

          <Stack>
            {projects.map((project) => {
              if (!project.hideOnResume) {
                return (
                  <ProjectDescription
                    key={project.title}
                    projectInfo={project}
                  />
                );
              }
            })}
          </Stack>
        </div>
      </Container>
    );
  }
}
