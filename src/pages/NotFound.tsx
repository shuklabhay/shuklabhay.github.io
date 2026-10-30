import PageTitle from "../components/PageTitle";

export default function NotFound() {
  return (
    <main
      className="route-page"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <PageTitle title="Page not found" />
    </main>
  );
}
