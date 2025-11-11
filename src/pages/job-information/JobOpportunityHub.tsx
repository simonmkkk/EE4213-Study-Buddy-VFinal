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
import { Building2, MapPin, Calendar, Bookmark, ExternalLink, ArrowLeft, Search } from "lucide-react";
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
    location: "Central, Hong Kong Island",
    type: "Internship",
    deadline: "2025-02-15",
    description: "Join our team to work on cutting-edge projects in cloud computing and AI. You'll collaborate with world-class engineers and contribute to products used by billions.",
    tags: ["IT", "Engineering", "AI", "Cloud"],
    highlightId: "job-deadline-google",
  },
  {
    id: "2",
    title: "Product Management Graduate",
    company: "Microsoft",
    location: "Kowloon Bay, Kowloon",
    type: "Graduate",
    deadline: "2025-03-01",
    description: "Lead product strategy for Microsoft Azure. This role involves working with cross-functional teams to deliver innovative cloud solutions.",
    tags: ["IT", "Product", "Cloud"],
  },
  {
    id: "3",
    title: "Financial Analyst Intern",
    company: "Goldman Sachs",
    location: "Admiralty, Hong Kong Island",
    type: "Internship",
    deadline: "2025-01-25",
    description: "Gain hands-on experience in investment banking. Analyze market trends, prepare client presentations, and support deal execution.",
    tags: ["Finance", "Banking", "Accounting"],
  },
  {
    id: "4",
    title: "UX Design Graduate",
    company: "Apple",
    location: "Tsim Sha Tsui, Kowloon",
    type: "Graduate",
    deadline: "2025-02-28",
    description: "Design intuitive user experiences for next-generation Apple products. Work with a talented team of designers and engineers.",
    tags: ["IT", "Design", "Creative"],
  },
  {
    id: "5",
    title: "Civil Engineering Intern",
    company: "AECOM",
    location: "Quarry Bay, Hong Kong Island",
    type: "Internship",
    deadline: "2025-02-20",
    description: "Work on major infrastructure projects in Hong Kong. Assist senior engineers in design, planning and project management of construction projects.",
    tags: ["Engineering", "Construction", "Infrastructure"],
  },
  {
    id: "6",
    title: "Marketing Graduate",
    company: "Cathay Pacific",
    location: "Hung Hom, Kowloon",
    type: "Graduate",
    deadline: "2025-03-10",
    description: "Join our marketing team to develop innovative campaigns for one of Asia's leading airlines. Work on brand strategy and customer engagement.",
    tags: ["Marketing", "Business", "Aviation"],
  },
  {
    id: "7",
    title: "Mechanical Engineer Intern",
    company: "MTR Corporation",
    location: "Kowloon Bay, Kowloon",
    type: "Internship",
    deadline: "2025-02-25",
    description: "Support the maintenance and engineering team for Hong Kong's railway system. Gain hands-on experience with mechanical systems.",
    tags: ["Engineering", "Mechanical", "Transportation"],
  },
  {
    id: "8",
    title: "Human Resources Graduate",
    company: "HSBC",
    location: "Central, Hong Kong Island",
    type: "Graduate",
    deadline: "2025-03-05",
    description: "Build your career in HR at one of the world's largest banking organizations. Focus on talent acquisition and employee development.",
    tags: ["HR", "Business", "Finance"],
  },
  {
    id: "9",
    title: "Data Analyst Intern",
    company: "Alibaba",
    location: "Tsuen Wan, New Territories",
    type: "Internship",
    deadline: "2025-03-15",
    description: "Analyze large datasets to drive business insights. Work with cutting-edge data analytics tools and machine learning models.",
    tags: ["IT", "Data", "Analytics"],
  },
  {
    id: "10",
    title: "Electrical Engineer Graduate",
    company: "CLP Power",
    location: "Yuen Long, New Territories",
    type: "Graduate",
    deadline: "2025-03-20",
    description: "Join our engineering team to work on power generation and distribution systems. Contribute to Hong Kong's energy infrastructure.",
    tags: ["Engineering", "Electrical", "Energy"],
  },
];

const JobOpportunityHub = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
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
    const tagMatch = selectedTag === "all" || job.tags.includes(selectedTag);
    const searchMatch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return typeMatch && locationMatch && tagMatch && searchMatch;
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
            Job List
          </PageTitle>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title, company, or tags (e.g., AI, Cloud, Finance)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
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
                  <SelectItem value="Hong Kong Island">Hong Kong Island</SelectItem>
                  <SelectItem value="Kowloon">Kowloon</SelectItem>
                  <SelectItem value="New Territories">New Territories</SelectItem>
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
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
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
            {categories.slice(0, 10).map((category) => (
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
            {!showAllTags && categories.length > 10 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAllTags(true)}
                className="rounded-full border-primary/30 text-foreground hover:bg-primary/10 bg-background"
              >
                Show More ({categories.length - 10}+)
              </Button>
            )}
            {showAllTags && (
              <>
                {/* Force line break */}
                <div className="basis-full h-0"></div>
                {categories.slice(10).map((category) => (
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAllTags(false)}
                  className="rounded-full border-primary/30 text-foreground hover:bg-primary/10 bg-background"
                >
                  Show Less
                </Button>
              </>
            )}
          </div>
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
                          onClick={() => handleSave(job)}
                          className="flex-shrink-0 h-10 w-10 group bg-green-100 hover:bg-green-200 rounded-lg"
                        >
                          <Bookmark className={`h-6 w-6 transition-all ${saved ? "fill-green-600 text-green-600" : "text-green-600 group-hover:fill-green-600"}`} />
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
                        
                        {/* Apply Button */}
                        <div className="pt-4">
                          <Button
                            variant="default"
                            size="default"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                            asChild
                          >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              Apply Now
                            </a>
                          </Button>
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
