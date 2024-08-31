import React, { createContext, useState, useContext } from "react";

export type ScrollInfo = {
  landingPosition: number;
  projectsPosition: number;
  qualificationsPositon: number;
  contactPosition: number;
  isLandingFocused: boolean;
  isProjectsFocused: boolean;
  isQualificationsFocused: boolean;
  isContactFocused: boolean;
};

type ScrollContextType = {
  scrollInformation: ScrollInfo;
  setScrollInformation: React.Dispatch<React.SetStateAction<ScrollInfo>>;
  scrollProgress: number;
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>;
};

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
    projectsPosition: 0,
    qualificationsPositon: 0,
    contactPosition: 0,
    isLandingFocused: false,
    isProjectsFocused: false,
    isQualificationsFocused: false,
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
