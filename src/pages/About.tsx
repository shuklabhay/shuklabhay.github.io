import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useState, useEffect, useMemo } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { ABOUT_TAG_ITEMS, Tag, ABOUT_ALLOWED_TAGS } from "../utils/types";
import ExperienceList from "../components/ExperienceList";
import ProjectList from "../components/ProjectList";
import AwardList from "../components/AwardList";
import { selectDesired } from "../utils/tags";

export default function About() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() =>
    loadTagsFromStorage<Tag>("about-tags", ABOUT_TAG_ITEMS),
  );
  const [ghData, setGhData] = useState<{
    contributions: number;
    linesModified: number;
  } | null>(null);

  useEffect(() => {
    fetch("/sitedata/ghdata.json")
      .then((r) => r.json())
      .then((d) => setGhData(d));
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
                <div style={{ marginTop: "2rem" }}>
                  <AwardList selectedTags={selectedTags} />
                </div>
              </div>
            ) : null}
            {ghData && hasContent ? (
              <div
                style={{
                  marginTop: "0.5rem",
                  textAlign: "right",
                  color: "white",
                  opacity: 0.9,
                  fontSize: "1rem",
                  fontStyle: "italic",
                  paddingBottom: "0.5rem",
                }}
              >
                {ghData.contributions.toLocaleString()} contributions •{" "}
                {ghData.linesModified.toLocaleString()} lines modified
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
