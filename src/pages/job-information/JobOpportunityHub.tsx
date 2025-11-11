import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
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
import { Building2, MapPin, Calendar, Bookmark, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { cn } from "@/lib/utils";

interface Job {
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

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineering Intern",
    company: "Google",
    location: "Mountain View, CA",
    type: "Internship",
    deadline: "2025-02-15",
    description: "Join our team to work on cutting-edge projects in cloud computing and AI. You'll collaborate with world-class engineers and contribute to products used by billions.",
    tags: ["Tech", "AI", "Cloud"],
    highlightId: "job-deadline-google",
  },
  {
    id: "2",
    title: "Product Management Graduate",
    company: "Microsoft",
    location: "Seattle, WA",
    type: "Graduate",
    deadline: "2025-03-01",
    description: "Lead product strategy for Microsoft Azure. This role involves working with cross-functional teams to deliver innovative cloud solutions.",
    tags: ["Tech", "Product", "Cloud"],
  },
  {
    id: "3",
    title: "Financial Analyst Intern",
    company: "Goldman Sachs",
    location: "New York, NY",
    type: "Internship",
    deadline: "2025-01-25",
    description: "Gain hands-on experience in investment banking. Analyze market trends, prepare client presentations, and support deal execution.",
    tags: ["Finance", "Banking"],
  },
  {
    id: "4",
    title: "UX Design Graduate",
    company: "Apple",
    location: "Cupertino, CA",
    type: "Graduate",
    deadline: "2025-02-28",
    description: "Design intuitive user experiences for next-generation Apple products. Work with a talented team of designers and engineers.",
    tags: ["Tech", "Design", "UX"],
  },
];

const JobOpportunityHub = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const { addJob, removeJob, isJobSaved } = useSavedJobs();
  const location = useLocation();
  const navigate = useNavigate();

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

  const categories = useMemo(() => {
    const uniqueTags = new Set<string>();
    jobs.forEach((job) => {
      job.tags.forEach((tag) => uniqueTags.add(tag));
    });
    return Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const typeMatch = typeFilter === "all" || job.type === typeFilter;
    const locationMatch = locationFilter === "all" || job.location.includes(locationFilter);
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const searchMatch =
      normalizedQuery.length === 0 ||
      [job.title, job.company, job.location, job.description, job.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const tagMatch = selectedTag === "all" || job.tags.includes(selectedTag);
    return typeMatch && locationMatch && searchMatch && tagMatch;
  });

  const handleSave = (job: Job) => {
    if (isJobSaved(job.id)) {
      removeJob(job.id);
      toast("Removed from saved jobs");
    } else {
      addJob({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        deadline: job.deadline,
        description: job.description,
        tags: job.tags,
        highlightId: job.highlightId,
      });
      toast.success("Job saved successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <PageTitle as="h1" className="text-5xl md:text-6xl">
            Job List
          </PageTitle>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search jobs"
              className="w-full sm:w-[260px]"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Position Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Graduate">Graduate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            asChild
            variant="default"
            className="self-start sm:self-auto sm:ml-auto"
          >
            <Link to="/job-information/saved-jobs">Saved Jobs</Link>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => setSelectedTag("all")}
            className={cn(
              "border-primary/30 text-foreground hover:bg-primary/10 rounded-full",
              "bg-background",
              selectedTag === "all" &&
                "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
            )}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              onClick={() => setSelectedTag(category)}
              className={cn(
                "border-primary/30 text-foreground hover:bg-primary/10 rounded-full",
                "bg-background",
                selectedTag === category &&
                  "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const saved = isJobSaved(job.id);
            return (
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
                          <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                          <p className="text-base text-foreground">{job.company}</p>
                        </div>
                        {/* Bookmark Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSave(job)}
                          className="flex-shrink-0 hover:bg-primary/10 h-10 w-10"
                        >
                          <Bookmark className={`h-6 w-6 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
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

                      {/* Tags and Buttons */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "bg-background border-gray-300 hover:bg-gray-50",
                              job.type === "Internship" || job.type === "Graduate"
                                ? "text-orange-600"
                                : "text-foreground"
                            )}
                          >
                            {job.type}
                          </Badge>
                          {job.tags.map((tag) => (
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
                            asChild
                          >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              Apply Now
                            </a>
                          </Button>
                        </div>
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

export default JobOpportunityHub;
