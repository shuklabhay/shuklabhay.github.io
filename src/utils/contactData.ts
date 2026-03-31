import type { ContactInfo } from "./types";

export const contactData: ReadonlyArray<ContactInfo> = [
  {
    title: "Resume",
    link: "https://docs.google.com/document/d/1AmxSqHyPKsZIAPha-v2eDTIGKNvpwcFVRLMoa6gTJuk/edit?tab=t.0",
  },
  {
    title: "Email",
    link: "01shuklabhay@gmail.com",
  },
  {
    title: "Linkedin",
    link: "https://www.linkedin.com/in/shuklabhay/",
  },
  {
    title: "GitHub",
    link: "https://github.com/shuklabhay",
  },
  {
    title: "Twitter",
    link: "https://x.com/01shuklabhay",
  },
  {
    title: "Website",
    link: "https://shuklabhay.github.io",
  },
];

export function getContactLink(
  contactItems: ReadonlyArray<ContactInfo>,
  title: string,
): string | undefined {
  return contactItems.find((contact: ContactInfo) => contact.title === title)
    ?.link;
}
