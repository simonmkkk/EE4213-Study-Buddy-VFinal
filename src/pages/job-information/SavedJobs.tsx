import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Calendar, Bookmark, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useSavedJobs } from "@/context/SavedJobsContext";

const SavedJobs = () => {
  const { savedJobs, removeJob } = useSavedJobs();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const state = location.state as { highlightId?: string; priority?: number } | null;
    const highlightId = state?.highlightId;
    const priority = state?.priority ?? 2; // Default to green (priority 2) if not specified
    
    if (!highlightId) {
      return;
    }

    const highlightElement = document.querySelector<HTMLElement>(`[data-highlight-id="${highlightId}"]`);
    if (!highlightElement) {
      navigate(location.pathname, { replace: true });
      return;
    }

    // Add priority-specific pulse class
    const pulseClass = priority === 0 ? "highlight-pulse-red" : priority === 1 ? "highlight-pulse-orange" : "highlight-pulse-green";
    highlightElement.classList.add(pulseClass);
    highlightElement.scrollIntoView({ behavior: "smooth", block: "center" });

    const timeout = window.setTimeout(() => {
      highlightElement.classList.remove(pulseClass);
      navigate(location.pathname, { replace: true });
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
      highlightElement.classList.remove(pulseClass);
    };
  }, [location, navigate]);

  const handleRemove = (jobId: string) => {
    removeJob(jobId);
    toast("Removed from saved jobs");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Button variant="default" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/job-information/job-hub')}
              className="gap-2 bg-primary text-white hover:bg-primary/90 hover:text-white border-primary"
            >
              <Search className="h-4 w-4" />
              Explore Jobs
            </Button>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Saved Jobs</h1>
        </div>

        {savedJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center space-y-4">
              <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No saved jobs yet</h2>
              <p className="text-sm text-muted-foreground">
                Explore opportunities and bookmark roles to see them here.
              </p>
              <Button 
                variant="default" 
                onClick={() => navigate('/job-information/job-hub')}
                className="mt-4"
              >
                <Search className="h-4 w-4 mr-2" />
                Explore Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {savedJobs
                .filter((job) =>
                  searchTerm === "" ||
                  job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  job.company.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((job) => (
              <Card key={job.id} className="transition-smooth hover:shadow-lg border-2" data-highlight-id={job.highlightId}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                            <Badge 
                              variant="outline" 
                              className="bg-slate-200 border-slate-600 text-slate-900 font-semibold"
                            >
                              {job.type}
                            </Badge>
                          </div>
                          <p className="text-base text-foreground">{job.company}</p>
                        </div>
                        {/* Bookmark Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(job.id)}
                          className="flex-shrink-0 h-10 w-10 group bg-green-100 hover:bg-green-200 rounded-lg"
                        >
                          <Bookmark className="h-6 w-6 transition-all fill-green-600 text-green-600" />
                        </Button>
                      </div>

                      {/* Location and Deadline */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {job.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">${job.type === "Internship" ? "8,000" : "85,000"}/month</span>
                        </div>
                      </div>

                      {/* Job Field Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-slate-200 border-slate-600 text-slate-900 font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Job Details - Always Expanded */}
                      <div className="pt-6 border-t space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">Job Description</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">Application Tips</h4>
                          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                            <li>Tailor your resume to highlight relevant experience</li>
                            <li>Prepare examples of past projects and achievements</li>
                            <li>Research the company culture and values</li>
                          </ul>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="pt-4 flex gap-3">
                          <Button
                            variant="default"
                            size="default"
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold"
                            asChild
                          >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              Apply Now
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => handleRemove(job.id)}
                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
