import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Briefcase, Target, Users, ArrowRight, Sparkles, GraduationCap, TrendingUp, Heart } from "lucide-react";

const LandingPage = () => {
  const modulesRef = useRef<HTMLElement | null>(null);

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
      title: "Career Information",
      description: "Discover career opportunities, track applications, and boost your professional development.",
      icon: Briefcase,
      path: "/job-information/dashboard",
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

      {/* Hero Section */}
      <section className="relative border-b border-border/60 bg-primary/15 backdrop-blur-lg">
        <div className="flex min-h-[calc(100vh-260px)] flex-col justify-start pt-32 pb-6 md:pt-52 md:pb-14">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Study Buddy, Your <span className="text-primary">Buddy</span>
            </h1>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="transition-smooth hover:-translate-y-0.5"
                onClick={() => modulesRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-smooth hover:-translate-y-0.5"
                asChild
              >
                <Link to="/community">Join Community</Link>
              </Button>
            </div>
          </div>

            {/* Stats Section - Inline */}
            <div className="container">
              <div className="flex justify-between items-start w-full pt-16">
                <div className="text-center space-y-4 flex-1">
                  <div className="flex items-center justify-center mb-4">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-5xl font-bold text-foreground">100+</div>
                  <div className="text-base text-muted-foreground whitespace-nowrap">Exchange Universities</div>
                </div>
                <div className="text-center space-y-4 flex-1">
                  <div className="flex items-center justify-center mb-4">
                    <Briefcase className="h-12 w-12 text-secondary" />
                  </div>
                  <div className="text-5xl font-bold text-foreground">500+</div>
                  <div className="text-base text-muted-foreground whitespace-nowrap">Job Opportunities</div>
                </div>
                <div className="text-center space-y-4 flex-1">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-12 w-12 text-rose-500" />
                  </div>
                  <div className="text-5xl font-bold text-foreground">1000+</div>
                  <div className="text-base text-muted-foreground whitespace-nowrap">Community Members</div>
                </div>
                <div className="text-center space-y-4 flex-1">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="h-12 w-12 text-accent" />
                  </div>
                  <div className="text-5xl font-bold text-foreground">85%</div>
                  <div className="text-base text-muted-foreground whitespace-nowrap">Productivity Boost</div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container pb-32 pt-8 md:pt-12" ref={modulesRef}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Modules</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
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
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Study Buddy</span>
              </div>
              <div className="text-sm text-muted-foreground">
                © 2025 Study Buddy
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
