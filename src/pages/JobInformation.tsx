import { PageTitle } from "@/components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Search, GraduationCap, Users } from "lucide-react";

const JobInformation = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Career Progress Dashboard",
      description: "Track internships, applications, and achievements with interactive analytics.",
      icon: BarChart3,
      path: "/job-information/dashboard",
      accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    },
    {
      title: "Job Opportunity Discovery Hub",
      description: "Browse curated roles, save leads, and manage outreach in one place.",
      icon: Search,
      path: "/job-information/job-hub",
      accent: "from-orange-500/15 to-orange-500/5 text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <PageTitle as="h1" className="font-bold text-5xl md:text-6xl">
            Career Information
          </PageTitle>
          <p className="text-lg text-muted-foreground mt-4">
            Start with a guided overview of your job search journey. Access analytics, discover new roles,
            and organise milestones across our career tools.
          </p>
        </div>

        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Career Tools</h2>
              <p className="text-muted-foreground">
                Jump straight into the workspace that matches the next action on your roadmap.
              </p>
            </div>
            <Button variant="secondary" className="self-start md:self-auto" onClick={() => navigate("/focus-learning")}>See learning plans</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.path}
                  className="group border-border/60 bg-background shadow-sm transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <CardHeader className="space-y-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold">{tool.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="group-hover:translate-x-1 transition-smooth" onClick={() => navigate(tool.path)}>
                      Enter workspace
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default JobInformation;
