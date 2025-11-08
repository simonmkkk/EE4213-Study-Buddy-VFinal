import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, UserPlus, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Community = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Academic Wall",
      description: "Join course discussions, ask questions, and get AI-powered answers from your academic community",
      icon: MessageSquare,
      path: "/community/academic-wall",
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Emotion Center",
      description: "Share your feelings anonymously in a safe, supportive space and connect with others",
      icon: Heart,
      path: "/community/emotion-center",
      color: "text-destructive",
      bgColor: "bg-destructive-light",
    },
    {
      title: "Soul Match",
      description: "Find a soul companion for meaningful one-on-one conversations based on shared emotions",
      icon: UserPlus,
      path: "/community/soul-match",
      color: "text-info",
      bgColor: "bg-info-light",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect, share, and grow together. Build meaningful relationships and find support in a warm, inclusive community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.path}
                className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 transition-smooth group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-smooth" size="sm">
                    Join Now
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

export default Community;
