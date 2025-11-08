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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface School {
  id: string;
  name: string;
  country: string;
  program: string;
  image: string;
  flag: string;
  rating: number;
  studentCount: number;
  courses: string[];
  reviews: { name: string; rating: number; date: string; content: string }[];
}

const schools: School[] = [
  {
    id: "eth",
    name: "ETH Zurich",
    country: "Switzerland",
    program: "Computer Science",
    image: "/placeholder.svg",
    flag: "🇨🇭",
    rating: 4.8,
    studentCount: 25,
    courses: ["AI", "Data Structures", "Algorithms"],
    reviews: [
      { name: "Alex Chen", rating: 5, date: "2025-01-15", content: "Amazing program with world-class faculty. Highly recommended!" },
      { name: "Sarah Kim", rating: 4, date: "2025-01-10", content: "Great courses, but challenging workload. Prepare well!" },
    ],
  },
  {
    id: "tum",
    name: "TU Munich",
    country: "Germany",
    program: "Engineering",
    image: "/placeholder.svg",
    flag: "🇩🇪",
    rating: 4.7,
    studentCount: 30,
    courses: ["Robotics", "Control Systems", "Mechatronics"],
    reviews: [
      { name: "John Mueller", rating: 5, date: "2025-01-12", content: "Excellent hands-on experience and industry connections." },
    ],
  },
  {
    id: "nus",
    name: "National University of Singapore",
    country: "Singapore",
    program: "Business",
    image: "/placeholder.svg",
    flag: "🇸🇬",
    rating: 4.9,
    studentCount: 40,
    courses: ["Finance", "Marketing", "Strategy"],
    reviews: [
      { name: "Wei Zhang", rating: 5, date: "2025-01-08", content: "Top-tier business education in Asia. Amazing opportunities!" },
    ],
  },
  {
    id: "uoft",
    name: "University of Toronto",
    country: "Canada",
    program: "Medicine",
    image: "/placeholder.svg",
    flag: "🇨🇦",
    rating: 4.6,
    studentCount: 20,
    courses: ["Anatomy", "Pharmacology", "Clinical Skills"],
    reviews: [
      { name: "Emma Watson", rating: 4, date: "2025-01-05", content: "Rigorous medical program with excellent clinical training." },
    ],
  },
  {
    id: "oxford",
    name: "University of Oxford",
    country: "United Kingdom",
    program: "Law",
    image: "/placeholder.svg",
    flag: "🇬🇧",
    rating: 4.9,
    studentCount: 15,
    courses: ["Constitutional Law", "Criminal Law", "International Law"],
    reviews: [
      { name: "James Brown", rating: 5, date: "2025-01-01", content: "Prestigious program with incredible networking opportunities." },
    ],
  },
];

const VisualSchoolExplorer = () => {
  const navigate = useNavigate();
  const [countryFilter, setCountryFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [reviewText, setReviewText] = useState("");

  const filteredSchools = schools.filter((school) => {
    const countryMatch = countryFilter === "all" || school.country === countryFilter;
    const programMatch = programFilter === "all" || school.program === programFilter;
    return countryMatch && programMatch;
  });

  const handleSchoolClick = (school: School) => {
    navigate("/overseas-exchange/syllabus-matcher", { state: { schoolId: school.id, schoolName: school.name } });
  };

  const handlePostReview = () => {
    if (reviewText.trim()) {
      toast.success("Review posted successfully!");
      setReviewText("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Visual School Explorer</h1>
          <p className="text-lg text-muted-foreground">
            Discover exchange schools and explore transferable courses
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="Switzerland">Switzerland</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            </SelectContent>
          </Select>

          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Law">Law</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* School Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card 
              key={school.id}
              className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10 text-3xl">{school.flag}</div>
              <CardContent className="p-6" onClick={() => handleSchoolClick(school)}>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{school.program}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {school.courses.map((course) => (
                    <Badge key={course} variant="secondary">{course}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{school.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{school.studentCount} students</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSchool(school);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Comments
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No schools found matching your filters</p>
          </div>
        )}
      </main>

      {/* Reviews Modal */}
      <Dialog open={!!selectedSchool} onOpenChange={() => setSelectedSchool(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSchool?.name} - Student Reviews</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedSchool?.reviews.map((review, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.name}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                  <p className="text-sm">{review.content}</p>
                </CardContent>
              </Card>
            ))}
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Share Your Experience</h3>
              <Textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mb-3"
              />
              <Button onClick={handlePostReview} className="w-full">
                Post Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisualSchoolExplorer;
