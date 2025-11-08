import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Calendar, Bookmark, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  tags: string[];
  saved: boolean;
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
    saved: false,
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
    saved: false,
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
    saved: false,
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
    saved: false,
  },
];

const JobOpportunityHub = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const typeMatch = typeFilter === "all" || job.type === typeFilter;
    const locationMatch = locationFilter === "all" || job.location.includes(locationFilter);
    return typeMatch && locationMatch;
  });

  const handleSave = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
    toast.success("Job saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Opportunity Discovery Hub</h1>
          <p className="text-lg text-muted-foreground">
            Explore internships and graduate positions tailored for you
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="transition-smooth hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
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
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                  </div>
                  <Button
                    variant={job.saved ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSave(job.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${job.saved ? "fill-current" : ""}`} />
                  </Button>
                </div>

                {expandedJob === job.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Job Description</h4>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Application Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Tailor your resume to highlight relevant skills</li>
                        <li>Prepare examples of past projects and achievements</li>
                        <li>Research the company culture and values</li>
                      </ul>
                    </div>
                    <Button variant="secondary" className="w-full" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Apply on Company Website
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  {expandedJob === job.id ? "Show Less" : "Show More"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JobOpportunityHub;
