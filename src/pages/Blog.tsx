import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useState } from "react";
import { loadTagsFromStorage } from "../utils/tags";
import { BLOG_TAG_ITEMS, Tag } from "../utils/types";

export default function Blog() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() =>
    loadTagsFromStorage<Tag>("blog-tags", BLOG_TAG_ITEMS),
  );

  return (
    <div>
      <PageTitle
        title="I also write"
        subtitle={
          <CheckboxSubtitle<Tag>
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
