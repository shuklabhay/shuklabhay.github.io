import { Navbar } from "../components/Navbar.tsx";

import Landing from "./Landing.tsx";
import Projects from "./Projects.tsx";
import Contact from "./Contact.tsx";

export default function PageStack() {
  return (
    <>
      {/* make thing navbar buttons change page scroll locations for each page, so maybe make scrolling a like context thing ??? */}
      <Landing />
      <Projects />
      <Contact />
    </>
  );
}
