import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import {
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { ABOUT_TAG_ITEMS, Tag, ABOUT_ALLOWED_TAGS } from "../utils/types";
import ExperienceList from "../components/ExperienceList";
import ProjectList from "../components/ProjectList";
import EducationList from "../components/EducationList";
import AwardList from "../components/AwardList";
import { selectDesired } from "../utils/tags";
import ghDataImport from "../../public/sitedata/ghdata.json";
import contactInfoImport from "../../public/sitedata/contact.json";
import experienceImport from "../../public/sitedata/experience.json";
import projectsImport from "../../public/sitedata/projects.json";
import educationImport from "../../public/sitedata/education.json";
import awardsImport from "../../public/sitedata/awards.json";

const DataContext = createContext<{
  experience: any[];
  projects: any[];
  education: any[];
  awards: any[];
  ghData: { contributions: number; linesModified: number } | null;
  contactInfo: { title: string; link: string }[];
}>({
  experience: experienceImport,
  projects: projectsImport,
  education: educationImport,
  awards: awardsImport,
  ghData: ghDataImport,
  contactInfo: contactInfoImport,
});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <DataContext.Provider
      value={{
        experience: experienceImport,
        projects: projectsImport,
        education: educationImport,
        awards: awardsImport,
        ghData: ghDataImport,
        contactInfo: contactInfoImport,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default function About() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() =>
    loadTagsFromStorage<Tag>("about-tags", ABOUT_TAG_ITEMS),
  );
  const { ghData, contactInfo } = useData();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 768;

  const hasContent = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    return desired.size > 0;
  }, [selectedTags]);

  return (
    <div>
      <PageTitle
        title="I do cool things"
        subtitle={
          <div>
            <CheckboxSubtitle<Tag>
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              items={ABOUT_TAG_ITEMS}
              storageKey="about-tags"
            />

            {selectedTags?.length ? (
              <div style={{ marginTop: "1.25rem" }}>
                <ExperienceList selectedTags={selectedTags} />
                <div style={{ marginTop: "2rem" }}>
                  <ProjectList selectedTags={selectedTags} />
                </div>
                <div style={{ marginTop: "1.5rem" }}>
                  <EducationList />
                </div>
                <div style={{ marginTop: "1.5rem" }}>
                  <AwardList selectedTags={selectedTags} />
                </div>
              </div>
            ) : null}
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: isSmallScreen ? "center" : "space-between",
                alignItems: "center",
                gap: isSmallScreen ? "0.5rem" : "1rem",
                paddingBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  color: "white",
                  opacity: 0.9,
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                {contactInfo
                  .filter((c) => c.title !== "Website")
                  .map((c, i, arr) => (
                    <span key={i}>
                      {c.title === "Email" ? (
                        <a
                          href={`mailto:${c.link}`}
                          style={{ color: "white", textDecoration: "none" }}
                        >
                          {c.link.replace("@", " [at] ")}
                        </a>
                      ) : (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "white", textDecoration: "none" }}
                        >
                          {c.title}
                        </a>
                      )}
                      {i < arr.length - 1 ? isSmallScreen ? <br /> : " • " : ""}
                    </span>
                  ))}
              </div>
              {ghData && hasContent ? (
                <div
                  style={{
                    color: "white",
                    opacity: 0.9,
                    fontSize: "1rem",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {ghData.contributions.toLocaleString()} contributions •{" "}
                  {ghData.linesModified.toLocaleString()} lines modified
                </div>
              ) : null}
            </div>
          </div>
        }
      />
    </div>
  );
}
