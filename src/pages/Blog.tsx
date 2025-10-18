import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";

export default function Blog() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PageTitle
        title="I also write"
        subtitle={
          <CheckboxList
            storageKey="blog-tags"
            items={[
              { label: "ML", defaultChecked: true },
              { label: "Life", defaultChecked: true },
            ]}
          />
        }
      />
    </div>
  );
}
