import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useState, useEffect, useMemo } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { ABOUT_TAG_ITEMS, Tag, ABOUT_ALLOWED_TAGS } from "../utils/types";
import ExperienceList from "../components/ExperienceList";
import ProjectList from "../components/ProjectList";
import EducationList from "../components/EducationList";
import AwardList from "../components/AwardList";
import { selectDesired } from "../utils/tags";

export default function About() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() =>
    loadTagsFromStorage<Tag>("about-tags", ABOUT_TAG_ITEMS)
  );
  const [ghData, setGhData] = useState<{
    contributions: number;
    linesModified: number;
  } | null>(null);
  const [contactInfo, setContactInfo] = useState<
    { title: string; link: string }[]
  >([]);

  useEffect(() => {
    fetch("/sitedata/ghdata.json")
      .then((r) => r.json())
      .then((d) => setGhData(d));
    fetch("/sitedata/contact.json")
      .then((r) => r.json())
      .then((d) => setContactInfo(d));
  }, []);

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
