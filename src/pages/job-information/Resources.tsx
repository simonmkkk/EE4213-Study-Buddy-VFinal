import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, ExternalLink, Bookmark, Calendar, ArrowLeft, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { useSavedResources } from "@/context/SavedResourcesContext";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
  icon: string;
  color: string;
  url?: string;
}

const Resources = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isResourceSaved, addResource, removeResource } = useSavedResources();
  
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const resources: Resource[] = [
    {
      id: "career-fair-tech",
      title: "Virtual Career Fair - Tech Companies",
      description: "Connect with leading tech companies and explore exciting career opportunities",
      category: "Event",
      date: "Dec 15, 2025",
      location: "Online",
      tags: ["Google", "Amazon", "Meta"],
      icon: "📋",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "resume-workshop",
      title: "Resume & Portfolio Workshop",
      description: "Learn to create compelling resumes and portfolios that stand out",
      category: "Workshop",
      date: "Dec 20, 2025",
      location: "Online",
      tags: ["Career", "Resume", "Portfolio"],
      icon: "📄",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "interview-bootcamp",
      title: "Technical Interview Bootcamp",
      description: "Intensive bootcamp covering technical interview preparation and strategies",
      category: "Workshop",
      date: "Jan 5, 2026",
      location: "Hybrid",
      tags: ["Interview", "Tech", "Coding"],
      icon: "�",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "linkedin-masterclass",
      title: "LinkedIn Networking Masterclass",
      description: "Master the art of professional networking on LinkedIn",
      category: "Workshop",
      date: "Dec 18, 2025",
      location: "Online",
      tags: ["LinkedIn", "Networking", "Career"],
      icon: "🔗",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "startup-career-fair",
      title: "Startup Career Fair 2026",
      description: "Meet innovative startups and explore opportunities in the startup ecosystem",
      category: "Event",
      date: "Jan 15, 2026",
      location: "Singapore",
      tags: ["Startup", "Innovation", "Tech"],
      icon: "🚀",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "salary-negotiation-seminar",
      title: "Salary Negotiation Seminar",
      description: "Learn effective strategies to negotiate your compensation package",
      category: "Seminar",
      date: "Jan 10, 2026",
      location: "Online",
      tags: ["Salary", "Negotiation", "Career"],
      icon: "💰",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "data-science-meetup",
      title: "Data Science Career Meetup",
      description: "Network with data science professionals and learn about career paths",
      category: "Meetup",
      date: "Dec 22, 2025",
      location: "Hybrid",
      tags: ["Data Science", "AI", "Machine Learning"],
      icon: "📊",
      color: "from-primary/15 to-primary/5 text-primary",
    },
    {
      id: "ux-design-conference",
      title: "UX Design Career Conference",
      description: "Explore UX design careers and connect with industry professionals",
      category: "Conference",
      date: "Jan 20, 2026",
      location: "Singapore",
      tags: ["UX", "Design", "UI"],
      icon: "🎨",
      color: "from-primary/15 to-primary/5 text-primary",
    },
  ];

  const allTags = useMemo(() => {
    const uniqueTags = new Set<string>();
    resources.forEach((resource) => {
      resource.tags.forEach((tag) => uniqueTags.add(tag));
    });
    return Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const filteredResources = resources.filter((resource) => {
    const categoryMatch = categoryFilter === "all" || resource.category === categoryFilter;
    const locationMatch = locationFilter === "all" || resource.location.includes(locationFilter);
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const searchMatch =
      normalizedQuery.length === 0 ||
      [resource.title, resource.description, resource.location, resource.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const tagMatch = selectedTag === "all" || resource.tags.includes(selectedTag);
    return categoryMatch && locationMatch && searchMatch && tagMatch;
  });

  useEffect(() => {
    const highlightId = (location.state as { highlightId?: string } | null)?.highlightId;
    if (!highlightId) {
      return;
    }

    const highlightElement = document.querySelector<HTMLElement>(`[data-highlight-id="${highlightId}"]`);
    if (!highlightElement) {
      navigate(location.pathname, { replace: true });
      return;
    }

    highlightElement.classList.add("highlight-pulse");
    highlightElement.scrollIntoView({ behavior: "smooth", block: "center" });

    const timeout = window.setTimeout(() => {
      highlightElement.classList.remove("highlight-pulse");
      navigate(location.pathname, { replace: true });
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      highlightElement.classList.remove("highlight-pulse");
    };
  }, [location, navigate]);

  const handleResourceClick = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, "_blank");
    } else {
      // Show more details or handle navigation
      console.log("Clicked resource:", resource);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <PageTitle as="h1" className="text-5xl md:text-6xl">
            Resource List
          </PageTitle>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by resource title, category, or tags (e.g., Career, Resume, Interview)..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Meetup">Meetup</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="default"
              className="self-start sm:self-auto sm:ml-auto"
              onClick={() => navigate("/job-information/saved-resources")}
            >
              Saved Resources
            </Button>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => setSelectedTag("all")}
              className={cn(
                "border-gray-300 text-foreground hover:bg-gray-50 rounded-full",
                "bg-background",
                selectedTag === "all" &&
                  "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
              )}
            >
              All Tags
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "border-gray-300 text-foreground hover:bg-gray-50 rounded-full",
                  "bg-background",
                  selectedTag === tag &&
                    "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const saved = isResourceSaved(resource.id);
            return (
              <Card
                key={resource.id}
                data-highlight-id={resource.id}
                className="transition-smooth hover:shadow-lg border-2"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {resource.icon}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground mb-1">{resource.title}</h3>
                          <p className="text-base text-muted-foreground">{resource.location}</p>
                        </div>
                        {/* Bookmark Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (saved) {
                              removeResource(resource.id);
                            } else {
                              addResource(resource);
                            }
                          }}
                          className="flex-shrink-0 hover:bg-primary/10 h-10 w-10"
                        >
                          <Bookmark className={`h-6 w-6 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        </Button>
                      </div>

                      {/* Date and Category */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{resource.date}</span>
                        </div>
                      </div>

                      {/* Tags and Button */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-background text-foreground border-gray-300 hover:bg-gray-50">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white font-medium"
                            onClick={() => handleResourceClick(resource)}
                          >
                            Register Now
                          </Button>
                        </div>
                      </div>

                      {/* Resource Details - Always Expanded */}
                      <div className="pt-6 border-t space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Resources;
