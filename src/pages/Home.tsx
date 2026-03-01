import { useEffect, useState } from "react";
import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useLocation } from "react-router-dom";
import type { ContactInfo, RouteTransitionState } from "../utils/types";

const POST_RETURN_FLAG_KEY = "route-from-post-return";

const contactPromise = fetch("/static/sitedata/contact.json").then((res) =>
  res.json(),
);

export default function Home() {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const fromPostReturnFlag =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(POST_RETURN_FLAG_KEY) === "1";
  const shouldAnimateSurfaceEntry =
    transitionState?.fromPost === true || fromPostReturnFlag;
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

  useEffect(() => {
    contactPromise
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const clearId = window.setTimeout(() => {
      window.sessionStorage.removeItem(POST_RETURN_FLAG_KEY);
    }, 0);
    return () => window.clearTimeout(clearId);
  }, []);

  const rawEmail = contactData.find((c) => c.title === "Email")?.link;
  const email = `mailto:${rawEmail}`;
  const github = contactData.find((c) => c.title === "GitHub")?.link;
  const linkedin = contactData.find((c) => c.title === "Linkedin")?.link;

  return (
    <main
      className={shouldAnimateSurfaceEntry ? "surface-page-return" : undefined}
    >
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <CheckboxSubtitle
            mode="link"
            hoverFill
            items={[
              { label: "Email", href: email },
              { label: "GitHub", href: github },
              { label: "LinkedIn", href: linkedin },
            ]}
          />
        }
      />
    </main>
  );
}
