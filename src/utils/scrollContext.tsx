import React, { createContext, useContext, useState } from "react";
import { ScrollContextType, ScrollInfo } from "./types";

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const scrollOffet = 45;

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    landingPosition: 0,
    accomplishmentsPosition: 0,
    skillsPosition: 0,
    contactPosition: 0,
    isLandingFocused: false,
    isAccomplishmentsFocused: false,
    isSkillsFocused: false,
    isContactFocused: false,
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <ScrollContext.Provider
      value={{
        scrollInformation: scrollInfo,
        setScrollInformation: setScrollInfo,
        scrollProgress: scrollProgress,
        setScrollProgress: setScrollProgress,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
