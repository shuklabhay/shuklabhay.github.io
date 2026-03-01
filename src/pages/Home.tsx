import { useState } from "react";
import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useLocation } from "react-router-dom";

interface ContactInfo {
  title: string;
  link: string;
}

const contactPromise = fetch("/static/sitedata/contact.json").then((res) =>
  res.json(),
);

export default function Home() {
  const location = useLocation();
  const fromPost =
    (location.state as { fromPost?: boolean } | null)?.fromPost === true;
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

  useState(() => {
    contactPromise
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  });

  const rawEmail = contactData.find((c) => c.title === "Email")?.link;
  const email = `mailto:${rawEmail}`;
  const github = contactData.find((c) => c.title === "GitHub")?.link;
  const linkedin = contactData.find((c) => c.title === "Linkedin")?.link;

  return (
    <main className={fromPost ? "surface-page-return" : undefined}>
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
