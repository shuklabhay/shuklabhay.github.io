import React, { createContext, useState, useContext } from "react";

type ScrollPositions = {
  landing: number;
  projects: number;
  contact: number;
};

type ScrollContextType = {
  verticalPositions: ScrollPositions;
  setVerticalPositions: React.Dispatch<React.SetStateAction<ScrollPositions>>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

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
  const [positions, setPositions] = useState<ScrollPositions>({
    landing: 0,
    projects: 0,
    contact: 0,
  });

  return (
    <ScrollContext.Provider
      value={{
        verticalPositions: positions,
        setVerticalPositions: setPositions,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
