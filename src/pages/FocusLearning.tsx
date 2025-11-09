import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ListTodo, ArrowRight } from "lucide-react";

const FocusLearning = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Focus Mode Dashboard",
      icon: Timer,
      path: "/focus-learning/focus-mode",
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Micro-Goal Study Tracker",
      icon: ListTodo,
      path: "/focus-learning/goal-tracker",
      color: "text-accent",
      bgColor: "bg-accent-light",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Focus Learning</h1>
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
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-smooth">
                    Start Focusing
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

export default FocusLearning;
