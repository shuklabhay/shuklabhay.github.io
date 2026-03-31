import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { contactData, getContactLink } from "../utils/contactData";

const RESUME_FALLBACK_PATH = "/about";
const resumeLink: string | undefined = getContactLink(contactData, "Resume");

export default function Resume(): JSX.Element {
  useEffect((): void => {
    if (!resumeLink) return;
    window.location.replace(resumeLink);
  }, []);

  if (!resumeLink) {
    return <Navigate replace to={RESUME_FALLBACK_PATH} />;
  }

  return <main />;
}
