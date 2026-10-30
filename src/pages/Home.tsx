import PageTitle, { CheckboxSubtitleLink } from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";
import { useRouteEntryFade } from "../utils/useEntryFade";

export default function Home(): JSX.Element {
  const entryFadeStyle = useRouteEntryFade(450);

  const rawEmail = getContactLink(contactData, "Email");
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const github = getContactLink(contactData, "GitHub");
  const linkedin = getContactLink(contactData, "Linkedin");

  return (
    <main
      style={{
        ...entryFadeStyle,
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <CheckboxSubtitleLink
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
