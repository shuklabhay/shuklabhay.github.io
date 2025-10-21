import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";
import { useState } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { ABOUT_TAG_ITEMS, AboutTag } from "../utils/types";
import ExperienceList from "../components/ExperienceList";

export default function About() {
  const [selectedTags, setSelectedTags] = useState<AboutTag[]>(() =>
    loadTagsFromStorage<AboutTag>("about-tags", ABOUT_TAG_ITEMS),
  );

  return (
    <div>
      <PageTitle
        title="I do cool things"
        subtitle={
          <div>
            <CheckboxList<AboutTag>
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              items={ABOUT_TAG_ITEMS}
              storageKey="about-tags"
            />
            <div style={{ marginTop: "1.25rem" }}>
              <ExperienceList selectedTags={selectedTags} />
            </div>
          </div>
        }
      />
    </div>
  );
}
