import { Box, Container, Group, Stack, Text } from "@mantine/core";
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

const SkillsDescription = ({ skills }: { skills: SkillData }) => {
  const technicalSkillsList = skills.technical.map((skill) => skill).join(", ");
  const otherSkillsList = skills.other.map((skill) => skill).join(", ");
  const Header = ({ skillType }: { skillType: string }) => {
    return (
      <Text fz={16} lh={1.5} mb={-15} fw={700} c={"white"}>
        {skillType} Skills
      </Text>
    );
  };

  return (
    <>
      <Stack style={{ marginBottom: -15 }}>
        <BulletPointList
          HeaderComponent={() => <Header skillType="Technical" />}
          details={stringToDetails(technicalSkillsList)}
        />
      </Stack>

      <BulletPointList
        HeaderComponent={() => <Header skillType="Other" />}
        details={stringToDetails(otherSkillsList)}
      />
    </>
  );
};

const AwardDescription = ({ awardInfo }: { awardInfo: AwardItem }) => {
  const { title, recievedYear, description } = awardInfo;
  const Header = () => {
    return (
      <Text fz={16} lh={1.5} mb={-15} fw={700} c={"white"}>
        ({recievedYear}) {title}
      </Text>
    );
  };

  return (
    <Stack mb={-10}>
      <BulletPointList
        HeaderComponent={() => <Header />}
        details={stringToDetails(description)}
      />
    </Stack>
  );
};

export default function PlainTextSite() {
  const [siteData, setSiteData] = useState<SiteData>();
  const navigate = useNavigate();

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
          <Text
            fz={26}
            lh={1.5}
            mt={10}
            ta="center"
            c="main"
            fw={700}
            style={{
              flex: 1,
              textAlign: "center",
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
              position: "absolute",
              top: isSmallScreen ? 20 : 15,
              right: isSmallScreen ? 20 : 10,
            }}
          >
            <SwitchViewButton navigateTo="/" />
          </div>

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
                <div
                  key={item.title}
                  style={{
                    margin: isSmallScreen ? 10 : 20,
                    marginTop: isSmallScreen ? -3 : 5,
                    marginBottom: 0,
                  }}
                >
                  <HoverHighlightText
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
                </div>
              );
            })}
            <div
              style={{
                margin: isSmallScreen ? 10 : 20,
                marginTop: isSmallScreen ? -5 : 5,
                marginBottom: 0,
              }}
            >
              <HoverHighlightText
                text={"PDF"}
                onClick={() => {
                  navigate("/resume.pdf");
                }}
                size={isSmallScreen ? 14 : 16}
              />
            </div>
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

        <div>
          <Text fz={22} lh={1.5} mt={10} ta={"left"} c="main" fw={700}>
            Education
          </Text>

          <Stack>
            {education.map((education) => {
              const Header = () => {
                return (
                  <Text fz={16} mb={-15}>
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
                />
              );
            })}
          </Stack>
        </div>

        <div>
          <Text fz={22} lh={1.5} mt={10} ta={"left"} c="main" fw={700}>
            Skills
          </Text>

          <Stack>
            <SkillsDescription skills={skills} />
          </Stack>
        </div>

        <div>
          <Text fz={22} lh={1.5} mt={10} ta={"left"} c="main" fw={700}>
            Awards
          </Text>

          <Stack mb={20}>
            {awards.map((award) => {
              if (!award.hideOnResume) {
                return <AwardDescription key={award.title} awardInfo={award} />;
              }
            })}
          </Stack>
        </div>
      </Container>
    );
  }
}
