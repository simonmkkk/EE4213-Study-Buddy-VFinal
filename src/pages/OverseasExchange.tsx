import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const OverseasExchange = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Visual School Explorer",
      description: "Browse exchange schools with interactive cards, view course offerings, and read student reviews",
      icon: Globe,
      path: "/overseas-exchange/visual-explorer",
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Syllabus Auto-Matcher",
      description: "Automatically match courses from partner universities with your home institution for credit transfer",
      icon: BookOpen,
      path: "/overseas-exchange/syllabus-matcher",
      color: "text-secondary",
      bgColor: "bg-secondary-light",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Overseas Exchange</h1>
          <p className="text-xl text-muted-foreground">
            Plan your international study experience with confidence. Explore partner universities and ensure your courses transfer seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.path}
                className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 transition-smooth group-hover:scale-110`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-smooth">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default OverseasExchange;
