import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import CheckboxList from "../components/CheckboxList";

interface ContactInfo {
  title: string;
  link: string;
}

export default function Home() {
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

  useEffect(() => {
    fetch("/sitedata/contact.json")
      .then((res) => res.json())
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

  const rawEmail = contactData.find((c) => c.title === "Email")?.link;
  const email = rawEmail
    ? rawEmail.startsWith("mailto:")
      ? rawEmail
      : `mailto:${rawEmail}`
    : undefined;
  const github = contactData.find((c) => c.title === "GitHub")?.link;
  const linkedin = contactData.find((c) => c.title === "Linkedin")?.link;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <CheckboxList
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
    </div>
  );
}
