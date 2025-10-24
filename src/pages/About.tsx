import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import {
  useState,
  useEffect,
  useMemo,
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

const DataContext = createContext<{
  experience: any[];
  projects: any[];
  education: any[];
  awards: any[];
  ghData: { contributions: number; linesModified: number } | null;
  contactInfo: { title: string; link: string }[];
}>({
  experience: [],
  projects: [],
  education: [],
  awards: [],
  ghData: null,
  contactInfo: [],
});

export function useData() {
  return useContext(DataContext);
}

let cachedData: any = null;
const dataPromise = Promise.all([
  fetch("/sitedata/ghdata.json").then((r) => r.json()),
  fetch("/sitedata/contact.json").then((r) => r.json()),
  fetch("/sitedata/experience.json").then((r) => r.json()),
  fetch("/sitedata/projects.json").then((r) => r.json()),
  fetch("/sitedata/education.json").then((r) => r.json()),
  fetch("/sitedata/awards.json").then((r) => r.json()),
]).then((data) => {
  cachedData = data;
  return data;
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [ghData, setGhData] = useState<{
    contributions: number;
    linesModified: number;
  } | null>(null);
  const [contactInfo, setContactInfo] = useState<
    { title: string; link: string }[]
  >([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    if (cachedData) {
      const [gh, contact, exp, proj, edu, awd] = cachedData;
      setGhData(gh);
      setContactInfo(contact);
      setExperience(exp);
      setProjects(proj);
      setEducation(edu);
      setAwards(awd);
    } else {
      dataPromise.then(([gh, contact, exp, proj, edu, awd]) => {
        setGhData(gh);
        setContactInfo(contact);
        setExperience(exp);
        setProjects(proj);
        setEducation(edu);
        setAwards(awd);
      });
    }
  }, []);

  return (
    <DataContext.Provider
      value={{ experience, projects, education, awards, ghData, contactInfo }}
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
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "0.5rem",
              }}
            >
              <div style={{ color: "white", opacity: 0.9, fontSize: "1rem" }}>
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
                      {i < arr.length - 1 ? " • " : ""}
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
