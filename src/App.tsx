import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Overseas Exchange Module */}
          <Route path="/overseas-exchange" element={<OverseasExchange />} />
          <Route path="/overseas-exchange/visual-explorer" element={<VisualSchoolExplorer />} />
          <Route path="/overseas-exchange/syllabus-matcher" element={<SyllabusAutoMatcher />} />
          
          {/* Job Information Module */}
          <Route path="/job-information" element={<JobInformation />} />
          <Route path="/job-information/dashboard" element={<CareerDashboard />} />
          <Route path="/job-information/job-hub" element={<JobOpportunityHub />} />
          
          {/* Focus Learning Module */}
          <Route path="/focus-learning" element={<FocusLearning />} />
          <Route path="/focus-learning/focus-mode" element={<FocusModeDashboard />} />
          <Route path="/focus-learning/goal-tracker" element={<MicroGoalTracker />} />
          
          {/* Community Module */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/academic-wall" element={<AcademicWall />} />
          <Route path="/community/emotion-center" element={<EmotionCenter />} />
          <Route path="/community/soul-match" element={<SoulMatch />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
