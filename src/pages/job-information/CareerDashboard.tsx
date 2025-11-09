import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Bookmark, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CareerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Jobs Saved",
      value: 12,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary-light",
      path: "/job-information/job-hub",
    },
    {
      title: "Resources Bookmarked",
      value: 8,
      icon: Bookmark,
      color: "text-secondary",
      bgColor: "bg-secondary-light",
      path: "/job-information/job-hub",
    },
    {
      title: "Applications in Progress",
      value: 5,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent-light",
      path: "/job-information/job-hub",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Here's your career journey overview.</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and stay organized in your career development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(stat.path)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Analytics Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Progress Analytics</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "75%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Skills Development</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "60%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Application Success Rate</span>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: "40%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Notifications */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Smart Notifications</h2>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-warning">
              <CardContent className="py-4">
                <p className="font-medium">Application Deadline Approaching</p>
                <p className="text-sm text-muted-foreground">Tech Internship at Google expires in 2 days</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardContent className="py-4">
                <p className="font-medium">Skill Course Completed</p>
                <p className="text-sm text-muted-foreground">Congratulations! You've completed "Advanced React Patterns"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerDashboard;
