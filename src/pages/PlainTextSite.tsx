import { Container, Stack, Text } from "@mantine/core";
import { getJSONDataForSite } from "../utils/data";
import { useEffect, useState } from "react";
import {
  SiteData,
  SkillData,
  ActivityItem,
  ProjectItem,
  AwardItem,
  stringToDetails,
} from "../utils/types";
import HoverHighlightText from "../components/HoverHighlightText";
import { getTimeframeLabel } from "../utils/dates";
import BulletPointList from "../components/CardComponents/BulletPointList";
import { useNavigate } from "react-router-dom";
import { isSmallScreen } from "../utils/scroll";
import SwitchViewButton from "../components/IconButtons/SwitchViewButton";

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
      <Text fz={16} lh={1.4} mb={-4}>
        <HoverHighlightText
          link={icon ? icon.link : undefined}
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

  return <BulletPointList HeaderComponent={Header} details={details} mb={8} />;
};

const ProjectDescription = ({ projectInfo }: { projectInfo: ProjectItem }) => {
  const { title, broadDescription, details, link } = projectInfo;
  const Header = () => {
    return (
      <Text fz={16} lh={1.4} mb={-4}>
        <HoverHighlightText
          link={link.length > 0 ? link[0].url : undefined}
          text={title}
          size={"inherit"}
          shade="light"
        />{" "}
        | {broadDescription}
      </Text>
    );
  };

  return <BulletPointList HeaderComponent={Header} details={details} mb={8} />;
};

const SkillsDescription = ({ skills }: { skills: SkillData }) => {
  const technicalSkillsList = skills.technical.map((skill) => skill).join(", ");
  const otherSkillsList = skills.other.map((skill) => skill).join(", ");
  const Header = ({ skillType }: { skillType: string }) => {
    return (
      <Text fz={16} lh={1.4} mb={-4} fw={700} c={"white"}>
        {skillType} Skills
      </Text>
    );
  };

  return (
    <Stack gap={12}>
      <BulletPointList
        HeaderComponent={() => <Header skillType="Technical" />}
        details={stringToDetails(technicalSkillsList)}
        mb={6}
      />
      <BulletPointList
        HeaderComponent={() => <Header skillType="Other" />}
        details={stringToDetails(otherSkillsList)}
        mb={6}
      />
    </Stack>
  );
};

const AwardDescription = ({ awardInfo }: { awardInfo: AwardItem }) => {
  const { title, receivedYear } = awardInfo;
  const Header = () => {
    return (
      <Text fz={16} lh={1.4} mb={-4}>
        <Text span c={"white"} fw={700} inherit>
          ({receivedYear})
        </Text>{" "}
        {title}
      </Text>
    );
  };

  return <Header />;
};

export default function PlainTextSite() {
  const [siteData, setSiteData] = useState<SiteData>();
  const navigate = useNavigate();

  const openResumeInNewTab = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

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
        <Stack gap={16}>
          <Stack gap={8} align="center">
            <Text
              fz={26}
              lh={1.3}
              mt={16}
              ta="center"
              c="main"
              fw={700}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              Abhay Shukla
            </Text>

            <div
              style={{
                position: isSmallScreen ? "absolute" : "fixed",
                top: isSmallScreen ? 19 : 15,
                right: isSmallScreen ? 20 : 10,
              }}
            >
              <SwitchViewButton navigateTo="/" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: isSmallScreen ? 16 : 24,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {contact.map((item) => {
                const isEmail = item.link.includes("@");
                const formattedLink = isEmail
                  ? `mailto:${item.link}`
                  : item.link;

                return (
                  <HoverHighlightText
                    key={item.title}
                    text={item.title}
                    link={item.title == "Website" ? undefined : formattedLink}
                    size={isSmallScreen ? 14 : 16}
                    onClick={
                      item.title == "Website"
                        ? () => {
                            navigate("/");
                          }
                        : undefined
                    }
                  />
                );
              })}
              <HoverHighlightText
                text={"PDF"}
                onClick={openResumeInNewTab}
                size={isSmallScreen ? 14 : 16}
              />
            </div>
          </Stack>

          <Stack gap={12}>
            <Text fz={22} lh={1.3} ta={"left"} c="main" fw={700}>
              Experience
            </Text>

            <Stack gap={12}>
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
          </Stack>

          <Stack gap={12}>
            <Text fz={22} lh={1.3} ta={"left"} c="main" fw={700}>
              Projects
            </Text>

            <Stack gap={12}>
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
          </Stack>

          <Stack gap={12}>
            <Text fz={22} lh={1.3} ta={"left"} c="main" fw={700}>
              Education
            </Text>

            <Stack gap={12}>
              {education.map((education) => {
                const Header = () => {
                  return (
                    <Text fz={16} lh={1.4} mb={-4}>
                      <Text span c={"white"} fw={700} inherit>
                        {education.school}
                      </Text>{" "}
                      | {education.degree}
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
                    mb={8}
                  />
                );
              })}
            </Stack>
          </Stack>

          <Stack gap={12}>
            <Text fz={22} lh={1.3} ta={"left"} c="main" fw={700}>
              Skills
            </Text>

            <SkillsDescription skills={skills} />
          </Stack>

          <Stack gap={12} mb={24}>
            <Text fz={22} lh={1.3} ta={"left"} c="main" fw={700}>
              Awards
            </Text>

            <Stack gap={12}>
              {awards.map((award) => {
                if (!award.hideOnResume) {
                  return (
                    <AwardDescription key={award.title} awardInfo={award} />
                  );
                }
              })}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    );
  }
}
