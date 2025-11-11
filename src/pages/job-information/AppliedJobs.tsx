import { useEffect, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, ExternalLink, FileText, MapPin, ArrowLeft, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface AppliedApplication {
  id: string;
  role: string;
  company: string;
  location: string;
  submittedOn: string;
  status: "Submitted" | "Interview" | "Assessment" | "Offer" | "Rejected";
  nextStep: string;
  portalUrl?: string;
  highlightId?: string;
}

const appliedApplications: AppliedApplication[] = [
  {
    id: "applied-google-ux",
    role: "UX Research Intern",
    company: "Google",
    location: "Singapore",
    submittedOn: "2024-10-28",
    status: "Interview",
    nextStep: "Portfolio review scheduled on Nov 15",
    portalUrl: "https://careers.google.com",
    highlightId: "applied-google-ux",
  },
  {
    id: "applied-grab-pm",
    role: "Product Management Graduate Associate",
    company: "Grab",
    location: "Singapore",
    submittedOn: "2024-10-20",
    status: "Assessment",
    nextStep: "Complete scenario-based assessment by Nov 12",
    portalUrl: "https://careers.grab.com",
    highlightId: "applied-grab-pm",
  },
  {
    id: "applied-dbs-tech",
    role: "Technology Analyst Program",
    company: "DBS Bank",
    location: "Singapore",
    submittedOn: "2024-09-15",
    status: "Submitted",
    nextStep: "Awaiting recruiter review",
    highlightId: "applied-dbs-tech",
  },
];

const statusVariant: Record<AppliedApplication["status"], "default" | "secondary" | "outline"> = {
  Submitted: "outline",
  Interview: "default",
  Assessment: "secondary",
  Offer: "default",
  Rejected: "secondary",
};

const AppliedJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredApplications = appliedApplications.filter((application) =>
    searchTerm === "" ||
    application.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/job-information')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
          <PageTitle className="text-5xl md:text-6xl">Applied Jobs</PageTitle>
          <p className="text-lg text-muted-foreground mt-4">
            Track every application, its current status, and upcoming actions in one place.
          </p>
        </div>

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

        <section className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="transition-smooth hover:shadow-md"
              data-highlight-id={application.highlightId}
            >
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{application.role}</CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><FileText className="h-4 w-4" />{application.company}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{application.location}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />Submitted {application.submittedOn}</span>
                  </div>
                </div>
                <Badge variant={statusVariant[application.status]} className="px-3 py-1 text-xs font-semibold uppercase">
                  {application.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Clock className="mt-0.5 h-4 w-4" />
                  <div>
                    <span className="font-medium text-foreground">Next step: </span>
                    {application.nextStep}
                  </div>
                </div>
                {application.portalUrl && (
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <a href={application.portalUrl} target="_blank" rel="noopener noreferrer">
                      Open application portal
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
};

export default AppliedJobs;
