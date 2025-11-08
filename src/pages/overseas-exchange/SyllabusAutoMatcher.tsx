import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { BookOpen, CheckCircle2, XCircle, Trophy, MessageSquare, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Course {
  code: string;
  name: string;
  credits: number;
  transferable: boolean;
  matchText?: string;
  keywords: string[];
}

const mockCourses: Record<string, Course[]> = {
  "eth-cs": [
    { code: "CS101", name: "Introduction to Artificial Intelligence", credits: 6, transferable: true, matchText: "Matches CS201 - AI Fundamentals", keywords: ["AI", "Machine Learning"] },
    { code: "CS102", name: "Data Structures and Algorithms", credits: 6, transferable: true, matchText: "Matches CS301 - Advanced Data Structures", keywords: ["Data Structures", "Algorithms"] },
    { code: "CS103", name: "Quantum Computing Basics", credits: 4, transferable: false, keywords: ["Quantum", "Computing"] },
    { code: "CS104", name: "Software Engineering", credits: 6, transferable: true, matchText: "Matches CS401 - Software Development", keywords: ["Software", "Engineering"] },
  ],
};

const SyllabusAutoMatcher = () => {
  const location = useLocation();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (location.state?.schoolId) {
      setSelectedSchool(location.state.schoolId);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedSchool && selectedMajor) {
      const key = `${selectedSchool}-${selectedMajor.toLowerCase().replace(/\s+/g, "")}`;
      setCourses(mockCourses[key] || []);
    } else {
      setCourses([]);
    }
  }, [selectedSchool, selectedMajor]);

  const stats = {
    total: courses.length,
    transferable: courses.filter(c => c.transferable).length,
    credits: `${courses.filter(c => c.transferable).reduce((sum, c) => sum + c.credits, 0)}/${courses.reduce((sum, c) => sum + c.credits, 0)}`,
  };

  const schoolName = selectedSchool === "eth" ? "ETH Zurich" : "Select a school";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Syllabus Auto-Matcher</h1>
          <p className="text-lg text-muted-foreground">
            Automatically match courses with your home institution
          </p>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Choose a school..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eth">ETH Zurich</SelectItem>
              <SelectItem value="tum">TU Munich</SelectItem>
              <SelectItem value="nus">National University of Singapore</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMajor} onValueChange={setSelectedMajor}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Choose a major..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="eng">Engineering</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!selectedSchool || !selectedMajor ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Select a school and major to get started</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary-light">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent-light">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transfer Eligible</p>
                      <p className="text-2xl font-bold">{stats.transferable}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-secondary-light">
                      <Trophy className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Eligible Credits</p>
                      <p className="text-2xl font-bold">{stats.credits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course List Title */}
            <h2 className="text-2xl font-bold mb-6">
              {selectedMajor === "cs" ? "Computer Science" : selectedMajor} Courses at {schoolName}
            </h2>

            {/* Course Cards */}
            <div className="space-y-4 mb-8">
              {courses.map((course) => (
                <Card key={course.code} className={course.transferable ? "border-accent" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {course.transferable ? (
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                          )}
                          <div>
                            <span className="font-semibold">{course.code}</span>
                            <span className="mx-2">-</span>
                            <span>{course.name}</span>
                          </div>
                        </div>
                        {course.matchText && (
                          <p className="text-sm text-accent ml-8 mb-2">{course.matchText}</p>
                        )}
                        <div className="flex flex-wrap gap-2 ml-8">
                          {course.keywords.map((keyword) => (
                            <Badge key={keyword} variant="outline">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant="secondary">{course.credits} credits</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View School Comments Button */}
            <div className="text-center">
              <Button onClick={() => setShowReviews(true)} variant="outline" size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                View School Comments
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Reviews Modal */}
      <Dialog open={showReviews} onOpenChange={setShowReviews}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{schoolName} - Student Reviews</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Alex Chen</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">2025-01-15</p>
                <p className="text-sm">Amazing program with world-class faculty. Highly recommended!</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyllabusAutoMatcher;
