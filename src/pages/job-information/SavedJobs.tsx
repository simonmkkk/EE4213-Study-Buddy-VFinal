import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Bookmark, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useSavedJobs } from "@/context/SavedJobsContext";

const SavedJobs = () => {
  const { savedJobs, removeJob } = useSavedJobs();
  const location = useLocation();
  const navigate = useNavigate();

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
          <h1 className="text-5xl md:text-6xl font-bold">Saved Jobs</h1>
        </div>

        {savedJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center space-y-2">
              <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No saved jobs yet</h2>
              <p className="text-sm text-muted-foreground">
                Explore opportunities and bookmark roles to see them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <Card key={job.id} className="transition-smooth hover:shadow-md" data-highlight-id={job.highlightId}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {job.deadline}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => handleRemove(job.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Button variant="default" className="w-full mt-4" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Continue Application
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
