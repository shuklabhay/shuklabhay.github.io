import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";
import { useState } from "react";
import { ABOUT_TAG_ITEMS, AboutTag } from "../utils/types";

export default function About() {
  const [selectedTags, setSelectedTags] = useState<AboutTag[]>([]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PageTitle
        title="I do cool things"
        subtitle={
          <CheckboxList<AboutTag>
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            items={ABOUT_TAG_ITEMS}
            storageKey="about-tags"
          />
        }
      />
    </div>
  );
}
