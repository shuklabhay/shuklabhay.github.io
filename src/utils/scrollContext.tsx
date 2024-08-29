import React, { createContext, useState, useContext } from "react";

// Scroll Helpers
export function scrollTo(scrollPosition: number) {
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
}

export function handleScrollProgressOpacity(
  goalPosition: number,
  setScrollOpacity: React.Dispatch<React.SetStateAction<number>>,
) {
  const scrollTop = window.scrollY;
  if (goalPosition > 0) {
    setScrollOpacity(1 - Math.min(1.2 * (scrollTop / goalPosition), 1));
  } else {
    setScrollOpacity(1);
  }
}

// Scroll context

type ScrollInfo = {
  landingPosition: number;
  projectsPosition: number;
  contactPosition: number;
  isLandingFocused: boolean;
  isProjectsFocused: boolean;
  isContactFocused: boolean;
};

type ScrollContextType = {
  scrollInformation: ScrollInfo;
  setScrollInformation: React.Dispatch<React.SetStateAction<ScrollInfo>>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const scrollOffet = 54;

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
    contactPosition: 0,
    isLandingFocused: false,
    isProjectsFocused: false,
    isContactFocused: false,
  });

  return (
    <ScrollContext.Provider
      value={{
        scrollInformation: scrollInfo,
        setScrollInformation: setScrollInfo,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
