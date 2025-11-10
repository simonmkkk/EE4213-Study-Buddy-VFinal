import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BackToTop from "@/components/BackToTop";
import VisualSchoolExplorer from "./pages/overseas-exchange/VisualSchoolExplorer";
import SyllabusAutoMatcher from "./pages/overseas-exchange/SyllabusAutoMatcher";
import JobInformation from "./pages/JobInformation";
import CareerDashboard from "./pages/job-information/CareerDashboard";
import JobOpportunityHub from "./pages/job-information/JobOpportunityHub";
import SavedJobs from "./pages/job-information/SavedJobs";
import AppliedJobs from "./pages/job-information/AppliedJobs";
import Resources from "./pages/job-information/Resources";
import SavedResources from "./pages/job-information/SavedResources";
import FocusLearning from "./pages/FocusLearning";
import FocusModeDashboard from "./pages/focus-learning/FocusModeDashboard";
import MicroGoalTracker from "./pages/focus-learning/MicroGoalTracker";
import Community from "./pages/Community";
import AcademicWall from "./pages/community/AcademicWall";
import EmotionCenter from "./pages/community/EmotionCenter";
import SoulMatch from "./pages/community/SoulMatch";
import NotFound from "./pages/NotFound";
import Navigation from "@/components/Navigation";
import { SavedJobsProvider } from "@/context/SavedJobsContext";
import { SavedResourcesProvider } from "@/context/SavedResourcesContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SavedJobsProvider>
        <SavedResourcesProvider>
          <BrowserRouter>
            <Navigation />
          <Routes>
          <Route
            path="/"
            element={
              <>
                <BackToTop />
                <LandingPage />
              </>
            }
          />
          
          {/* Overseas Exchange Module */}
          <Route path="/overseas-exchange" element={<Navigate to="/overseas-exchange/visual-explorer" replace />} />
          <Route
            path="/overseas-exchange/visual-explorer"
            element={
              <>
                <BackToTop />
                <VisualSchoolExplorer />
              </>
            }
          />
          <Route
            path="/overseas-exchange/syllabus-matcher"
            element={
              <>
                <BackToTop />
                <SyllabusAutoMatcher />
              </>
            }
          />
          
          {/* Job Information Module */}
          <Route
            path="/job-information"
            element={
              <>
                <BackToTop />
                <JobInformation />
              </>
            }
          />
          <Route
            path="/job-information/dashboard"
            element={
              <>
                <BackToTop />
                <CareerDashboard />
              </>
            }
          />
          <Route
            path="/job-information/job-hub"
            element={
              <>
                <BackToTop />
                <JobOpportunityHub />
              </>
            }
          />
          <Route
            path="/job-information/saved-jobs"
            element={
              <>
                <BackToTop />
                <SavedJobs />
              </>
            }
          />
          <Route
            path="/job-information/applied-jobs"
            element={
              <>
                <BackToTop />
                <AppliedJobs />
              </>
            }
          />
          <Route
            path="/job-information/resources"
            element={
              <>
                <BackToTop />
                <Resources />
              </>
            }
          />
          <Route
            path="/job-information/saved-resources"
            element={
              <>
                <BackToTop />
                <SavedResources />
              </>
            }
          />
          
          {/* Focus Learning Module */}
          <Route
            path="/focus-learning"
            element={
              <>
                <BackToTop />
                <FocusLearning />
              </>
            }
          />
          <Route
            path="/focus-learning/focus-mode"
            element={
              <>
                <BackToTop />
                <FocusModeDashboard />
              </>
            }
          />
          <Route
            path="/focus-learning/goal-tracker"
            element={
              <>
                <BackToTop />
                <MicroGoalTracker />
              </>
            }
          />
          
          {/* Community Module */}
          <Route
            path="/community"
            element={
              <>
                <BackToTop />
                <Community />
              </>
            }
          />
          <Route
            path="/community/academic-wall"
            element={
              <>
                <BackToTop />
                <AcademicWall />
              </>
            }
          />
          <Route
            path="/community/emotion-center"
            element={
              <>
                <BackToTop />
                <EmotionCenter />
              </>
            }
          />
          <Route
            path="/community/soul-match"
            element={
              <>
                <BackToTop />
                <SoulMatch />
              </>
            }
          />
          
          {/* 404 */}
          <Route
            path="*"
            element={
              <>
                <BackToTop />
                <NotFound />
              </>
            }
          />
          </Routes>
        </BrowserRouter>
        </SavedResourcesProvider>
      </SavedJobsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
