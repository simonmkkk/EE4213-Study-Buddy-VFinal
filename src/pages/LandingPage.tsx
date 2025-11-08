import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Briefcase, Target, Users, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const LandingPage = () => {
  const modules = [
    {
      title: "Overseas Exchange",
      description: "Explore exchange schools, compare transferable courses, and make informed decisions for your international study journey.",
      icon: Globe,
      path: "/overseas-exchange",
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Job Information",
      description: "Discover career opportunities, track applications, analyze skill gaps, and boost your professional development.",
      icon: Briefcase,
      path: "/job-information",
      color: "text-secondary",
      bgColor: "bg-secondary-light",
    },
    {
      title: "Focus Learning",
      description: "Enhance your productivity with Pomodoro timers, micro-goal tracking, and focused study sessions.",
      icon: Target,
      path: "/focus-learning",
      color: "text-accent",
      bgColor: "bg-accent-light",
    },
    {
      title: "Community",
      description: "Connect with peers through course discussions, emotional support, and meaningful conversations.",
      icon: Users,
      path: "/community",
      color: "text-info",
      bgColor: "bg-info-light",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your Complete
            <span className="text-primary"> Study Companion</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Study Buddy empowers students with tools for academic success, career development, focused learning, and meaningful connections.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/overseas-exchange">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/community">Join Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Explore Our Modules</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for academic and personal growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.path}
                  className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                  onClick={() => window.location.href = module.path}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 transition-smooth group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${module.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{module.title}</CardTitle>
                    <CardDescription className="text-base">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-smooth" asChild>
                      <Link to={module.path}>
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-3">About Study Buddy</h3>
              <p className="text-sm text-muted-foreground">
                Your all-in-one platform for academic success and personal growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/overseas-exchange" className="hover:text-foreground transition-smooth">Overseas Exchange</Link></li>
                <li><Link to="/job-information" className="hover:text-foreground transition-smooth">Job Information</Link></li>
                <li><Link to="/focus-learning" className="hover:text-foreground transition-smooth">Focus Learning</Link></li>
                <li><Link to="/community" className="hover:text-foreground transition-smooth">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <p className="text-sm text-muted-foreground">
                © 2025 Study Buddy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
