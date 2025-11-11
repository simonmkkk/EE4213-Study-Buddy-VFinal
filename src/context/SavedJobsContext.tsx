import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  tags: string[];
  highlightId?: string;
}

interface SavedJobsContextValue {
  savedJobs: SavedJob[];
  addJob: (job: SavedJob) => void;
  removeJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextValue | undefined>(undefined);

const initialSavedJobs: SavedJob[] = [
  {
    id: "saved-1",
    title: "Software Engineering Intern",
    company: "Google",
    location: "Central, Hong Kong Island",
    type: "Internship",
    deadline: "2025-02-15",
    description:
      "Contribute to real production features across Google Workspace while collaborating with cross-functional teams.",
    tags: ["IT", "Engineering", "Cloud"],
    highlightId: "saved-job-google",
  },
  {
    id: "saved-2",
    title: "Product Design Graduate Associate",
    company: "Shopify",
    location: "Tsim Sha Tsui, Kowloon",
    type: "Graduate",
    deadline: "2025-03-05",
    description:
      "Shape intuitive rider experiences by leading design sprints and partnering with engineering and data teams.",
    tags: ["Design", "Creative", "IT"],
  },
  {
    id: "saved-3",
    title: "Financial Analyst Internship",
    company: "Goldman Sachs",
    location: "Admiralty, Hong Kong Island",
    type: "Internship",
    deadline: "2025-02-25",
    description:
      "Analyze financial data and support investment decisions in a fast-paced environment.",
    tags: ["Finance", "Analytics", "Banking"],
    highlightId: "saved-goldman-sachs",
  },
  {
    id: "saved-4",
    title: "UX Design Intern",
    company: "Apple",
    location: "Tsim Sha Tsui, Kowloon",
    type: "Internship",
    deadline: "2025-03-10",
    description:
      "Design innovative user experiences for Apple's next-generation products.",
    tags: ["IT", "Design", "Creative"],
    highlightId: "interview-apple",
  },
];

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialSavedJobs);

  const addJob = (job: SavedJob) => {
    setSavedJobs((prev) => {
      if (prev.some((savedJob) => savedJob.id === job.id)) {
        return prev;
      }
      return [...prev, job];
    });
  };

  const removeJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const isJobSaved = (jobId: string) => savedJobs.some((job) => job.id === jobId);

  const value = useMemo(
    () => ({
      savedJobs,
      addJob,
      removeJob,
      isJobSaved,
    }),
    [savedJobs]
  );

  return <SavedJobsContext.Provider value={value}>{children}</SavedJobsContext.Provider>;
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return context;
};
