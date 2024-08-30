import { createContext, useContext, useEffect, useState } from "react";

interface SiteData {
  awards: AwardData[];
  ghStats: GHStatsData;
  projects: ProjectData[];
  skills: SkillsData[];
}
const DataContext = createContext<SiteData | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [siteData, setSiteData] = useState<SiteData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [awards, ghStats, projects, skills] = await getSiteData();

        setSiteData({ awards, ghStats, projects, skills });
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={siteData}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
