import type { ContactInfo } from "./types";

const CONTACT_DATA_URL = "/static/sitedata/contact.json";

export const contactPromise: Promise<ContactInfo[]> = fetch(
  CONTACT_DATA_URL,
).then(async (res) => {
  if (!res.ok) {
    throw new Error(`Failed to load contact data: ${res.status}`);
  }

  return (await res.json()) as ContactInfo[];
});

export function getContactLink(contactData: ContactInfo[], title: string) {
  return contactData.find((contact) => contact.title === title)?.link;
}
