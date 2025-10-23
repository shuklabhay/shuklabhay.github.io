import { useEffect, useState } from "react";
import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";

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
  const email = `mailto:${rawEmail}`;
  const github = contactData.find((c) => c.title === "GitHub")?.link;
  const linkedin = contactData.find((c) => c.title === "Linkedin")?.link;

  return (
    <div>
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
    </div>
  );
}
