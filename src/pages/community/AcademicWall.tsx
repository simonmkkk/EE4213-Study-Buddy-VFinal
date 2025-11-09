import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Send, Lightbulb, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  activeStudents: number;
}

interface QA {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  author: string;
}

const courses: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamentals of programming, algorithms, and data structures.",
    activeStudents: 42,
  },
  {
    id: "math201",
    code: "MATH201",
    name: "Linear Algebra",
    description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
    activeStudents: 35,
  },
  {
    id: "phys301",
    code: "PHYS301",
    name: "Quantum Mechanics",
    description: "Wave functions, Schrödinger equation, and quantum phenomena.",
    activeStudents: 28,
  },
  {
    id: "bus101",
    code: "BUS101",
    name: "Business Strategy",
    description: "Strategic planning, competitive analysis, and business models.",
    activeStudents: 50,
  },
];

const AcademicWall = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [question, setQuestion] = useState("");
  const [qas, setQas] = useState<QA[]>([
    {
      id: "1",
      question: "Can someone explain the difference between pointers and references?",
      answer: "Great question! Pointers store memory addresses and can be reassigned, while references are aliases to existing variables and cannot be changed after initialization. Pointers can be null, but references must always refer to a valid object.",
      timestamp: new Date(Date.now() - 3600000),
      author: "Alex Chen",
    },
  ]);

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
    };

    setQas([newQA, ...qas]);
    setQuestion("");
    toast.success("Your question has been posted with AI answer!");
  };

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Course Discussion Groups</h1>
            <p className="text-lg text-muted-foreground">
              Join course-specific discussions and get AI-powered answers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
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
                      <Badge variant="secondary" className="mb-2">{course.code}</Badge>
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setSelectedCourse(null)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course List
        </Button>

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
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
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
