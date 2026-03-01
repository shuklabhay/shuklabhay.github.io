import PageTitle from "../components/PageTitle";

export default function About() {
  return (
    <main>
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div
            style={{
              color: "white",
              maxWidth: "48rem",
              lineHeight: 1.6,
              marginTop: "0.5rem",
              fontSize: "1.1rem",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "1rem" }}>
              I'm building cool things and keeping this page simple for now.
            </p>
            <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              Previously, I've done some cool stuff:
            </p>
            <ul style={{ marginTop: 0, paddingLeft: "1.25rem" }}>
              <li>Placeholder 1</li>
              <li>Placeholder 2</li>
              <li>Placeholder 3</li>
            </ul>
          </div>
        }
      />
    </main>
  );
}
