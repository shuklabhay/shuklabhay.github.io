import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";
import { useState } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { BLOG_TAG_ITEMS, BlogTag } from "../utils/types";

export default function Blog() {
  const [selectedTags, setSelectedTags] = useState<BlogTag[]>(() =>
    loadTagsFromStorage<BlogTag>("blog-tags", BLOG_TAG_ITEMS),
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PageTitle
        title="I also write"
        subtitle={
          <CheckboxList<BlogTag>
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            storageKey="blog-tags"
            items={BLOG_TAG_ITEMS}
          />
        }
      />
    </div>
  );
}
