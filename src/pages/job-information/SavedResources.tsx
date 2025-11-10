import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Bookmark, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useSavedResources } from "@/context/SavedResourcesContext";

const SavedResources = () => {
  const { savedResources, removeResource } = useSavedResources();
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

  const handleRemove = (resourceId: string) => {
    removeResource(resourceId);
    toast("Removed from saved resources");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="default" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Saved Resources</h1>
        </div>

        {savedResources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center space-y-2">
              <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No saved resources yet</h2>
              <p className="text-sm text-muted-foreground">
                Explore resources and bookmark them to see them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by resource title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {savedResources
                .filter((resource) =>
                  searchTerm === "" ||
                  resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  resource.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((resource) => (
              <Card key={resource.id} className="transition-smooth hover:shadow-md" data-highlight-id={resource.highlightId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-primary mb-3">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Dec 15, 2025</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-background text-foreground border-gray-300">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-shrink-0"
                      onClick={() => handleRemove(resource.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                    onClick={() => {
                      if (resource.url) {
                        window.open(resource.url, "_blank");
                      }
                    }}
                  >
                    Register Now
                  </Button>
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

export default SavedResources;
