import React, { createContext, useContext, useEffect, useState } from "react";
import { AppContextType, AppInfo, ScrollInfo } from "./types";

const AppContext = createContext<AppContextType | undefined>(undefined);

const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

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
  const [appInfo, setAppInfo] = useState<AppInfo>(() =>
    loadFromLocalStorage("appInfo", {
      isViewingSelectOpen: true,
      defaultView: undefined,
    })
  );
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

  useEffect(() => {
    saveToLocalStorage("appInfo", appInfo);
  }, [appInfo]);

  return (
    <AppContext.Provider
      value={{
        appInformation: appInfo,
        setAppInformation: setAppInfo,
        scrollInformation: scrollInfo,
        setScrollInformation: setScrollInfo,
        scrollProgress: scrollProgress,
        setScrollProgress: setScrollProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
