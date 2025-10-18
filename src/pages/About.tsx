import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";

export default function About() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PageTitle
        title="I do cool things"
        subtitle={
          <CheckboxList
            storageKey="about-tags"
            items={[
              { label: "ML", defaultChecked: true },
              { label: "Software" },
              { label: "MechE" },
              { label: "Growth" },
            ]}
          />
        }
      />
    </div>
  );
}
