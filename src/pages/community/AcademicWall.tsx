import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Send, Lightbulb, MessageSquare, Search, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  activeStudents: number;
  major: string;
}

interface QAComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface QA {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  author: string;
  comments: QAComment[];
}

const courses: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamentals of programming, algorithms, and data structures.",
    activeStudents: 42,
    major: "CS",
  },
  {
    id: "math201",
    code: "MATH201",
    name: "Linear Algebra",
    description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
    activeStudents: 35,
    major: "MATH",
  },
  {
    id: "phys301",
    code: "PHY301",
    name: "Quantum Mechanics",
    description: "Wave functions, Schrödinger equation, and quantum phenomena.",
    activeStudents: 28,
    major: "PHY",
  },
  {
    id: "bus101",
    code: "BUS101",
    name: "Business Strategy",
    description: "Strategic planning, competitive analysis, and business models.",
    activeStudents: 50,
    major: "BUS",
  },
  {
    id: "phy1202",
    code: "PHY1202",
    name: "General Physics II",
    description: "Electricity, magnetism, and electromagnetic waves.",
    activeStudents: 45,
    major: "PHY",
  },
  {
    id: "cs201",
    code: "CS201",
    name: "Data Structures",
    description: "Advanced data structures and algorithm analysis.",
    activeStudents: 38,
    major: "CS",
  },
  {
    id: "math301",
    code: "MATH301",
    name: "Calculus III",
    description: "Multivariable calculus and vector analysis.",
    activeStudents: 32,
    major: "MATH",
  },
];

const AcademicWall = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [question, setQuestion] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [qas, setQas] = useState<QA[]>([
    {
      id: "1",
      question: "Can someone explain the difference between pointers and references?",
      answer: "Great question! Pointers store memory addresses and can be reassigned, while references are aliases to existing variables and cannot be changed after initialization. Pointers can be null, but references must always refer to a valid object.",
      timestamp: new Date(Date.now() - 3600000),
      author: "Anonymous Student",
      comments: [],
    },
  ]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const handleAskQuestion = () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    // Simulate AI response
    const aiAnswer = "This is a great question! Based on the course material, here's what I can help with: The concept relates to fundamental principles we covered in the lectures. I recommend reviewing the lecture notes and trying the practice problems for a deeper understanding.";
    
    const newQA: QA = {
      id: Date.now().toString(),
      question: question,
      answer: aiAnswer,
      timestamp: new Date(),
      author: "You",
      comments: [],
    };

    setQas([newQA, ...qas]);
    setQuestion("");
    toast.success("Your question has been posted with AI answer!");
  };

  const handleToggleComment = (qaId: string) => {
    setActiveCommentId((prev) => (prev === qaId ? null : qaId));
    setCommentDrafts((prev) => ({ ...prev, [qaId]: prev[qaId] ?? "" }));
  };

  const handleCommentChange = (qaId: string, value: string) => {
    setCommentDrafts((prev) => ({ ...prev, [qaId]: value }));
  };

  const handleSubmitComment = (qaId: string) => {
    const draft = commentDrafts[qaId]?.trim();
    if (!draft) {
      toast.error("Please enter a comment before posting.");
      return;
    }

    const anonymousNames = ["Supportive Scholar", "Encouraging Peer", "Kind Classmate", "Thoughtful Study Buddy"];
    const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];

    const newComment: QAComment = {
      id: Date.now().toString(),
      author: randomName,
      content: draft,
      timestamp: new Date(),
    };

    setQas((prev) =>
      prev.map((qa) =>
        qa.id === qaId ? { ...qa, comments: [...qa.comments, newComment] } : qa,
      ),
    );

    setCommentDrafts((prev) => ({ ...prev, [qaId]: "" }));
    setActiveCommentId(null);
    toast.success("Comment added anonymously.");
  };

  const handleDeleteComment = (qaId: string, commentId: string) => {
    setQas((prev) =>
      prev.map((qa) =>
        qa.id === qaId
          ? { ...qa, comments: qa.comments.filter((comment) => comment.id !== commentId) }
          : qa,
      ),
    );
    toast.success("Comment deleted successfully.");
  };

  // Filter courses based on major and search query
  const filteredCourses = courses.filter((course) => {
    const matchesMajor = selectedMajor === "all" || course.major === selectedMajor;
    const matchesSearch = searchQuery === "" || course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMajor && matchesSearch;
  });

  // Get unique majors for filter dropdown
  const majors = ["all", ...Array.from(new Set(courses.map((c) => c.major)))];


  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold">Course Discussion Groups</h1>
            <p className="text-lg text-muted-foreground mt-4">
              Join course-specific discussions and get AI-powered answers
            </p>
          </div>

          {/* Filter and Search Section */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by course code (e.g., PHY1202)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by major" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major === "all" ? "All Majors" : major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{course.code}</Badge>
                        <Badge variant="outline">{course.major}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{course.activeStudents} active students</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No courses found. Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-2">{selectedCourse.code}</Badge>
          <h1 className="text-4xl font-bold mb-2">{selectedCourse.name}</h1>
          <p className="text-lg text-muted-foreground">{selectedCourse.description}</p>
        </div>

        {/* AI Smart Answer Banner */}
        <Card className="mb-8 bg-info-light border-info">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-info" />
              <p className="text-sm">
                Ask below to get instant AI answers for this course; classmates can also share and supplement.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ask Question Block */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Ask a Question</h3>
            </div>
            <Textarea
              placeholder="What would you like to know about this course?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <Button onClick={handleAskQuestion} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Ask
            </Button>
          </CardContent>
        </Card>

        {/* Q&A Display Area */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Questions & Answers</h2>
          
          {qas.map((qa) => (
            <Card key={qa.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Question */}
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <MessageSquare className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{qa.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {qa.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{qa.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Answer */}
                  <div className="ml-8 pl-4 border-l-2 border-accent">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-accent">AI Answer</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{qa.answer}</p>
                  </div>

                  {/* Comment Section */}
                  <div className="ml-8">
                    <div className="space-y-3">
                      {qa.comments.length > 0 && (
                        <div className="space-y-3">
                          {qa.comments.map((comment) => (
                            <div key={comment.id} className="rounded-lg border border-border p-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground text-sm">{comment.author}</span>
                                  <span>{comment.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(qa.id, comment.id)}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              <p className="text-sm text-foreground/90">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeCommentId === qa.id ? (
                        <div className="rounded-xl border border-border bg-background/90 shadow-sm">
                          <div className="p-4 space-y-3">
                            <Textarea
                              placeholder="Share a supportive comment..."
                              value={commentDrafts[qa.id] ?? ""}
                              onChange={(event) => handleCommentChange(qa.id, event.target.value)}
                              rows={3}
                              className="resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActiveCommentId(null);
                                  setCommentDrafts((prev) => ({ ...prev, [qa.id]: "" }));
                                }}
                              >
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleSubmitComment(qa.id)}>
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleToggleComment(qa.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {qas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcademicWall;
