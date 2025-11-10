import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface SavedResource {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  url?: string;
  color: string;
  highlightId?: string;
}

interface SavedResourcesContextValue {
  savedResources: SavedResource[];
  addResource: (resource: SavedResource) => void;
  removeResource: (resourceId: string) => void;
  isResourceSaved: (resourceId: string) => boolean;
}

const SavedResourcesContext = createContext<SavedResourcesContextValue | undefined>(undefined);

const initialSavedResources: SavedResource[] = [
  {
    id: "ux-portfolio",
    title: "UX Portfolio Playbook",
    description: "A comprehensive guide to building a standout UX portfolio",
    category: "Portfolio",
    icon: "🎨",
    color: "from-rose-500/15 to-rose-500/5 text-rose-600",
    highlightId: "ux-portfolio",
  },
  {
    id: "tech-interview",
    title: "Tech Interview Prep Checklist",
    description: "Essential checklist for technical interview preparation",
    category: "Interviews",
    icon: "📋",
    color: "from-blue-500/15 to-blue-500/5 text-blue-600",
    highlightId: "tech-interview",
  },
  {
    id: "grad-tracker",
    title: "Graduate Program Tracker",
    description: "Track and manage your graduate program applications",
    category: "Career",
    icon: "📊",
    color: "from-purple-500/15 to-purple-500/5 text-purple-600",
    highlightId: "grad-tracker",
  },
  {
    id: "interview-bootcamp",
    title: "Technical Interview Bootcamp",
    description: "Intensive bootcamp for mastering technical interviews",
    category: "Interviews",
    icon: "💻",
    color: "from-green-500/15 to-green-500/5 text-green-600",
    highlightId: "interview-bootcamp",
  },
  {
    id: "resume-workshop",
    title: "Resume & Portfolio Workshop",
    description: "Workshop on crafting exceptional resumes and portfolios",
    category: "Career",
    icon: "📝",
    color: "from-amber-500/15 to-amber-500/5 text-amber-600",
    highlightId: "resume-workshop",
  },
];

export const SavedResourcesProvider = ({ children }: { children: ReactNode }) => {
  const [savedResources, setSavedResources] = useState<SavedResource[]>(initialSavedResources);

  const addResource = (resource: SavedResource) => {
    setSavedResources((prev) => {
      if (prev.some((r) => r.id === resource.id)) {
        return prev;
      }
      return [...prev, resource];
    });
  };

  const removeResource = (resourceId: string) => {
    setSavedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const isResourceSaved = (resourceId: string) => {
    return savedResources.some((r) => r.id === resourceId);
  };

  const value: SavedResourcesContextValue = useMemo(
    () => ({
      savedResources,
      addResource,
      removeResource,
      isResourceSaved,
    }),
    [savedResources]
  );

  return <SavedResourcesContext.Provider value={value}>{children}</SavedResourcesContext.Provider>;
};

export const useSavedResources = () => {
  const context = useContext(SavedResourcesContext);
  if (!context) {
    throw new Error("useSavedResources must be used within a SavedResourcesProvider");
  }
  return context;
};
