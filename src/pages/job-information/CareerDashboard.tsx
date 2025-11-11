import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Bookmark, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { useState } from "react";

const CareerDashboard = () => {
  const navigate = useNavigate();
  const { savedJobs } = useSavedJobs();
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());
  const savedJobsCount = savedJobs.length;
  const savedJobsPreview = savedJobs.slice(0, 3);
  const additionalSavedJobs = Math.max(savedJobsCount - savedJobsPreview.length, 0);
  const savedResourcesCount = 8;
  const resourceHighlights = [
    "Interview preparation guides",
    "Resume templates",
    "Industry insights",
  ];
  const savedResourcesPreview = [
    "UX Portfolio Playbook",
    "Tech Interview Prep Checklist",
    "Graduate Program Tracker",
  ];
  const jobOpportunityHighlights = [
    { label: "New roles this week", value: "12" },
    { label: "Matching your profile", value: "6" },
    { label: "Closing soon", value: "3" },
  ];

  const notifications = [
    {
      type: "APPLICATION DEADLINE",
      status: "Closing Soon",
      description: "Software Engineering Intern at Google (saved job) - Application closes in 2 days",
      dueInDays: 2,
      path: "/job-information/saved-jobs",
      highlightId: "saved-job-google",
      priority: 0,
    },
    {
      type: "SAVED JOB UPDATE",
      status: "Expiring",
      description: "Financial Analyst Internship at Goldman Sachs (saved job) closes in 10 days",
      dueInDays: 10,
      path: "/job-information/saved-jobs",
      highlightId: "saved-goldman-sachs",
      priority: 1,
    },
    {
      type: "INTERVIEW REMINDER",
      status: "Scheduled",
      description: "Your interview with Apple UX Design team is scheduled for Dec 20, 2025 at 2:00 PM",
      dueInDays: 20,
      path: "/job-information/saved-jobs",
      highlightId: "interview-apple",
      priority: 2,
    },
    {
      type: "SAVED RESOURCE ALERT",
      status: "Starting Soon",
      description: "Technical Interview Bootcamp (saved resource) starts in 7 days. Register now!",
      dueInDays: 7,
      path: "/job-information/saved-resources",
      highlightId: "interview-bootcamp",
      priority: 1,
    },
    {
      type: "RESOURCE DEADLINE",
      status: "Limited Spots",
      description: "Resume & Portfolio Workshop (saved resource) - Only 3 spots remaining, closes Dec 25",
      dueInDays: 15,
      path: "/job-information/saved-resources",
      highlightId: "resume-workshop",
      priority: 2,
    },
  ];

  const sortedNotifications = [...notifications].sort((a, b) => a.dueInDays - b.dueInDays);
  const badgeBaseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide border-2";
  const getBadgeClasses = (position: number) => {
    if (position === 0) {
      return "border-red-400 bg-red-100 text-red-700";
    }

    if (position === 1) {
      return "border-orange-400 bg-orange-100 text-orange-700";
    }

    return "border-gray-400 bg-transparent text-black";
  };

  const handleDismissNotification = (notificationType: string) => {
    setDismissedNotifications(prev => new Set([...prev, notificationType]));
  };

  const filteredNotifications = sortedNotifications.filter(notification => !dismissedNotifications.has(notification.type));

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <PageTitle className="text-5xl md:text-6xl">Dashboard</PageTitle>
        </div>
        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <PageTitle as="h2">Job</PageTitle>
            </div>
            <Card className="md:w-64 border-none shadow-none">
              <CardContent className="p-0 flex items-center justify-center">
                <Button
                  className="w-full"
                  onClick={() => navigate("/job-information/applied-jobs")}
                >
                  My Application
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-[7fr_3fr] md:auto-rows-fr">
            <Card className="h-full transition-smooth hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-primary-light p-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-0">Job List</h2>
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  {jobOpportunityHighlights.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{item.value}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button className="self-start" onClick={() => navigate("/job-information/job-hub")}>Browse Job List</Button>
              </CardContent>
            </Card>

            <Card className="h-full transition-smooth hover:shadow-lg hover:-translate-y-1 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-secondary-light p-3">
                    <Bookmark className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-0">Job Saved</h2>
                </div>
                <p className="text-3xl font-bold mb-4">{savedJobsCount}</p>
                {savedJobsPreview.length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                    {savedJobsPreview.map((job) => (
                      <li key={job.id} className="flex items-start justify-between gap-4">
                        <span className="truncate font-medium text-foreground">{job.title}</span>
                        <span className="truncate text-muted-foreground">{job.company}</span>
                      </li>
                    ))}
                    {additionalSavedJobs > 0 && (
                      <li className="text-xs text-muted-foreground">+{additionalSavedJobs} more saved roles</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mb-6 flex-1">
                    You have not saved any jobs yet. Browse the Job Hub to get started.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors self-start"
                  onClick={() => navigate("/job-information/saved-jobs")}
                >
                  Manage Saved Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12 mt-7">
          <div className="mb-6">
            <PageTitle as="h2">Resources</PageTitle>
          </div>
          <div className="grid gap-6 md:grid-cols-[7fr_3fr] md:auto-rows-fr">
            <Card className="h-full transition-smooth hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-accent-light p-3">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-0">Resource List</h3>
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  {resourceHighlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>•</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="self-start"
                  onClick={() => navigate("/job-information/resources", { state: { highlightId: "resources" } })}
                >
                  Browse Resource List
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full transition-smooth hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-secondary-light p-3">
                    <Bookmark className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-0">Resources Saved</h3>
                </div>
                <p className="text-3xl font-bold mb-4">{savedResourcesCount}</p>
                <div className="space-y-2 mb-6 flex-1">
                  {savedResourcesPreview.map((resource) => (
                    <div key={resource} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>•</span>
                      <span>{resource}</span>
                    </div>
                  ))}
                  {Math.max(savedResourcesCount - savedResourcesPreview.length, 0) > 0 && (
                    <div className="text-xs text-muted-foreground">
                      +{Math.max(savedResourcesCount - savedResourcesPreview.length, 0)} more saved resources
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="self-start border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground w-full"
                  onClick={() => navigate("/job-information/saved-resources")}
                >
                  Manage Saved Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-7">
          <PageTitle as="h2" className="mb-6">
            Smart Notifications
          </PageTitle>
          <div className="space-y-3 min-h-[600px]">
            {filteredNotifications.map((notification, index) => (
              <Card
                key={notification.type}
                role="button"
                tabIndex={0}
                className="transition-all duration-300 ease-out hover:shadow-md cursor-pointer"
                onClick={() =>
                  notification.path &&
                  navigate(notification.path, {
                    state: notification.highlightId ? { highlightId: notification.highlightId, priority: notification.priority } : undefined,
                  })
                }
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && notification.path) {
                    event.preventDefault();
                    navigate(notification.path, {
                      state: notification.highlightId ? { highlightId: notification.highlightId, priority: notification.priority } : undefined,
                    });
                  }
                }}
              >
                <CardContent className="py-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${badgeBaseClasses} ${getBadgeClasses(index)}`}>
                        {notification.type}
                      </span>
                      <span className="text-sm font-medium text-black">{notification.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 hover:bg-red-100 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismissNotification(notification.type);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareerDashboard;
