import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";
import { useState } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { ABOUT_TAG_ITEMS, Tag } from "../utils/types";
import ExperienceList from "../components/ExperienceList";
import ProjectList from "../components/ProjectList";

export default function About() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() =>
    loadTagsFromStorage<Tag>("about-tags", ABOUT_TAG_ITEMS)
  );

  return (
    <div>
      <PageTitle
        title="I do cool things"
        subtitle={
          <div>
            <CheckboxList<Tag>
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
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
