import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BackToTop from "@/components/BackToTop";
import OverseasExchange from "./pages/OverseasExchange";
import VisualSchoolExplorer from "./pages/overseas-exchange/VisualSchoolExplorer";
import SyllabusAutoMatcher from "./pages/overseas-exchange/SyllabusAutoMatcher";
import JobInformation from "./pages/JobInformation";
import CareerDashboard from "./pages/job-information/CareerDashboard";
import JobOpportunityHub from "./pages/job-information/JobOpportunityHub";
import FocusLearning from "./pages/FocusLearning";
import FocusModeDashboard from "./pages/focus-learning/FocusModeDashboard";
import MicroGoalTracker from "./pages/focus-learning/MicroGoalTracker";
import Community from "./pages/Community";
import AcademicWall from "./pages/community/AcademicWall";
import EmotionCenter from "./pages/community/EmotionCenter";
import SoulMatch from "./pages/community/SoulMatch";
import NotFound from "./pages/NotFound";
import Navigation from "@/components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route
            path="/overseas-exchange"
            element={
              <>
                <BackToTop />
                <OverseasExchange />
              </>
            }
          />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
