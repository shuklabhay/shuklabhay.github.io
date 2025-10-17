import React, { createContext, useContext, useMemo, useState } from "react";
import { AppContextType, ScrollInfo, SiteData } from "./types";
import { getJSONDataForSite } from "./data";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const scrollOffet = 45;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    landingPosition: 0,
    experiencePosition: 0,
    skillsPosition: 0,
    aboutMePosition: 0,
    isLandingFocused: false,
    isExperienceFocused: false,
    isSkillsFocused: false,
    isAboutMeFocused: false,
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const siteData: SiteData = getJSONDataForSite();

  const contextValue = useMemo(
    () => ({
      scrollInformation: scrollInfo,
      setScrollInformation: setScrollInfo,
      scrollProgress: scrollProgress,
      setScrollProgress: setScrollProgress,
      siteData: siteData,
    }),
    [scrollInfo, scrollProgress, siteData],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
