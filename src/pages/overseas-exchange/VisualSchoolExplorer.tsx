import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, MessageSquare, ArrowLeft, Search, Edit2, Trash2, X, Check, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface School {
  id: string;
  name: string;
  country: string;
  majors: string[];
  image: string;
  rating: number;
  reviews: { name: string; rating: number; date: string; content: string; isUser?: boolean }[];
}

const schools: School[] = [
  {
    id: "eth",
    name: "ETH Zurich",
    country: "Switzerland",
    majors: ["Computer Science", "Electrical Engineering", "Mathematics", "Data Science"],
    image: "/eth-zurich.jpg",
    rating: 4.8,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-01-15", content: "Amazing program with world-class faculty. Highly recommended!" },
      { name: "Anonymous Student", rating: 4, date: "2025-01-10", content: "Great courses, but challenging workload. Prepare well!" },
    ],
  },
  {
    id: "tum",
    name: "TU Munich",
    country: "Germany",
    majors: ["Mechanical Engineering", "Aerospace Engineering", "Robotics", "Industrial Engineering"],
    image: "/tu-munich.jpg",
    rating: 4.7,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-01-12", content: "Excellent hands-on experience and industry connections." },
    ],
  },
  {
    id: "nus",
    name: "National University of Singapore",
    country: "Singapore",
    majors: ["Business Administration", "Finance", "Marketing", "Information Systems"],
    image: "/nus.jpg",
    rating: 4.9,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-01-08", content: "Top-tier business education in Asia. Amazing opportunities!" },
    ],
  },
  {
    id: "uoft",
    name: "University of Toronto",
    country: "Canada",
    majors: ["Medicine", "Biomedical Sciences", "Public Health", "Neuroscience"],
    image: "/uoft.jpg",
    rating: 4.6,
    reviews: [
      { name: "Anonymous Student", rating: 4, date: "2025-01-05", content: "Rigorous medical program with excellent clinical training." },
    ],
  },
  {
    id: "oxford",
    name: "University of Oxford",
    country: "United Kingdom",
    majors: ["Law", "International Relations", "Philosophy", "Public Policy"],
    image: "/oxford.jpg",
    rating: 4.9,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-01-01", content: "Prestigious program with incredible networking opportunities." },
    ],
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    country: "United States",
    majors: ["Computer Science", "Physics", "Aerospace Engineering", "Artificial Intelligence"],
    image: "/images/mit.jpg",
    rating: 4.9,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-02-02", content: "Cutting-edge research opportunities and inspiring faculty." },
      { name: "Anonymous Student", rating: 4, date: "2025-01-28", content: "Intense workload but unparalleled innovation culture." },
    ],
  },
  {
    id: "utokyo",
    name: "University of Tokyo",
    country: "Japan",
    majors: ["Materials Science", "Computer Engineering", "Architecture", "Robotics"],
    image: "/images/_Tokyo_University_3.jpg",
    rating: 4.7,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-01-20", content: "Beautiful campus and supportive professors for exchange students." },
    ],
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    country: "Australia",
    majors: ["Environmental Science", "Medicine", "Data Analytics", "Business"],
    image: "/images/Melbone.jpg",
    rating: 4.8,
    reviews: [
      { name: "Anonymous Student", rating: 4, date: "2025-01-18", content: "Great student life with strong academic support services." },
    ],
  },
  {
    id: "hec",
    name: "HEC Paris",
    country: "France",
    majors: ["Business Administration", "Entrepreneurship", "Finance", "Luxury Management"],
    image: "/images/HEC.png",
    rating: 4.6,
    reviews: [
      { name: "Anonymous Student", rating: 5, date: "2025-02-05", content: "Fantastic networking opportunities and real-world projects." },
    ],
  },
  {
    id: "snu",
    name: "Seoul National University",
    country: "South Korea",
    majors: ["Computer Science", "Bioengineering", "Economics", "Design"],
    image: "/images/Souel.jpg",
    rating: 4.7,
    reviews: [
      { name: "Anonymous Student", rating: 4, date: "2025-01-30", content: "Rigorous academics with vibrant campus culture." },
    ],
  },
];

const countryOptions = Array.from(new Set(schools.map((school) => school.country))).sort();
const majorOptions = Array.from(new Set(schools.flatMap((school) => school.majors))).sort();

const VisualSchoolExplorer = () => {
  const navigate = useNavigate();
  const [schoolsData, setSchoolsData] = useState<School[]>(schools);
  const [countryFilter, setCountryFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [editingReviewIndex, setEditingReviewIndex] = useState<number | null>(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [editingReviewRating, setEditingReviewRating] = useState(0);
  const [openCountry, setOpenCountry] = useState(false);
  const [openProgram, setOpenProgram] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [programSearchTerm, setProgramSearchTerm] = useState("");

  const filteredSchools = schoolsData.filter((school) => {
    const countryMatch = countryFilter === "all" || school.country === countryFilter;
    const programMatch = programFilter === "all" || school.majors.includes(programFilter);
    const searchMatch = 
      searchTerm === "" ||
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.majors.some((major) => major.toLowerCase().includes(searchTerm.toLowerCase()));
    return countryMatch && programMatch && searchMatch;
  });

  const handleSchoolClick = (school: School) => {
    navigate("/overseas-exchange/syllabus-matcher", { state: { schoolId: school.id, schoolName: school.name } });
  };

  const handlePostReview = () => {
    if (!selectedSchool) {
      return;
    }

    if (!reviewRating) {
      toast.error("Please select a rating before posting your review.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please share some feedback before posting.");
      return;
    }

    const newReview = {
      name: "You",
      rating: reviewRating,
      date: new Date().toISOString().split("T")[0],
      content: reviewText.trim(),
      isUser: true,
    };

    const updatedSchools = schoolsData.map((school) =>
      school.id === selectedSchool.id
        ? { ...school, reviews: [...school.reviews, newReview] }
        : school,
    );

    setSchoolsData(updatedSchools);
    setSelectedSchool(updatedSchools.find((school) => school.id === selectedSchool.id) ?? null);
    toast.success("Review posted successfully!");
    setReviewText("");
    setReviewRating(0);
  };

  const handleEditReview = (index: number) => {
    if (!selectedSchool) return;
    const review = selectedSchool.reviews[index];
    setEditingReviewIndex(index);
    setEditingReviewText(review.content);
    setEditingReviewRating(review.rating);
  };

  const handleSaveEdit = (index: number) => {
    if (!selectedSchool) return;

    if (!editingReviewRating) {
      toast.error("Please select a rating before updating your review.");
      return;
    }

    if (!editingReviewText.trim()) {
      toast.error("Please share some feedback before updating.");
      return;
    }

    const updatedReviews = [...selectedSchool.reviews];
    updatedReviews[index] = {
      ...updatedReviews[index],
      rating: editingReviewRating,
      content: editingReviewText.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updatedSchools = schoolsData.map((school) =>
      school.id === selectedSchool.id
        ? { ...school, reviews: updatedReviews }
        : school,
    );

    setSchoolsData(updatedSchools);
    setSelectedSchool(updatedSchools.find((school) => school.id === selectedSchool.id) ?? null);
    toast.success("Review updated successfully!");
    setEditingReviewIndex(null);
    setEditingReviewText("");
    setEditingReviewRating(0);
  };

  const handleCancelEdit = () => {
    setEditingReviewIndex(null);
    setEditingReviewText("");
    setEditingReviewRating(0);
  };

  const handleUpdateReview = () => {
    if (!selectedSchool || editingReviewIndex === null) return;

    if (!reviewRating) {
      toast.error("Please select a rating before updating your review.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please share some feedback before updating.");
      return;
    }

    const updatedReviews = [...selectedSchool.reviews];
    updatedReviews[editingReviewIndex] = {
      ...updatedReviews[editingReviewIndex],
      rating: reviewRating,
      content: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updatedSchools = schoolsData.map((school) =>
      school.id === selectedSchool.id
        ? { ...school, reviews: updatedReviews }
        : school,
    );

    setSchoolsData(updatedSchools);
    setSelectedSchool(updatedSchools.find((school) => school.id === selectedSchool.id) ?? null);
    toast.success("Review updated successfully!");
    setReviewText("");
    setReviewRating(0);
    setEditingReviewIndex(null);
  };

  const handleDeleteReview = (index: number) => {
    if (!selectedSchool) return;

    const updatedReviews = selectedSchool.reviews.filter((_, i) => i !== index);

    const updatedSchools = schoolsData.map((school) =>
      school.id === selectedSchool.id
        ? { ...school, reviews: updatedReviews }
        : school,
    );

    setSchoolsData(updatedSchools);
    setSelectedSchool(updatedSchools.find((school) => school.id === selectedSchool.id) ?? null);
    toast.success("Review deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <PageTitle as="h1" className="text-5xl md:text-6xl">
            School Explorer
          </PageTitle>
          <p className="text-lg text-muted-foreground mt-4">
            Discover exchange schools and explore transferable courses
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by school name, country, or major (e.g., Computer Science, Business)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Country & Program</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover open={openCountry} onOpenChange={setOpenCountry}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCountry}
                  className="w-full sm:w-[200px] justify-between"
                >
                  {countryFilter === "all"
                    ? "All Countries"
                    : countryOptions.find((country) => country === countryFilter) || "Select Country"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setCountryFilter("all");
                        setOpenCountry(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          countryFilter === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Countries
                    </CommandItem>
                    {countryOptions.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={() => {
                          setCountryFilter(country);
                          setOpenCountry(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            countryFilter === country ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover open={openProgram} onOpenChange={setOpenProgram}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProgram}
                  className="w-full sm:w-[200px] justify-between"
                >
                  {programFilter === "all"
                    ? "All Programs"
                    : majorOptions.find((major) => major === programFilter) || "Select Program"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search program..." />
                  <CommandEmpty>No program found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setProgramFilter("all");
                        setOpenProgram(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          programFilter === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Programs
                    </CommandItem>
                    {majorOptions.map((major) => (
                      <CommandItem
                        key={major}
                        value={major}
                        onSelect={() => {
                          setProgramFilter(major);
                          setOpenProgram(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            programFilter === major ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {major}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* School Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const commentDisplayCount = 2;
            return (
              <Card key={school.id} className="overflow-hidden border-2 border-white shadow-none">
                <CardContent className="p-4 space-y-3">
                  {/* Main School Info Card */}
                  <Card 
                    className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group border-slate-200"
                    onClick={() => handleSchoolClick(school)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-foreground">{school.country}</span>
                      </div>

                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {brokenImages[school.id] ? (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-center px-4">
                            <p className="text-sm text-muted-foreground">Image unavailable for {school.name}</p>
                          </div>
                        ) : (
                          <img
                            src={school.image}
                            alt={school.name}
                            className="w-full h-full object-cover"
                            onError={() => setBrokenImages((prev) => ({ ...prev, [school.id]: true }))}
                            loading="lazy"
                          />
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-3 leading-tight">{school.name}</h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {school.majors.map((major) => (
                          <Badge key={`${school.id}-${major}`} variant="outline" className="bg-slate-200 border-slate-600 text-slate-900 font-semibold">{major}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{school.rating}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchool(school);
                          }}
                          className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary hover:border-primary border border-slate-300 rounded-md px-3 py-1.5 transition-all hover:shadow-sm bg-slate-50"
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>{commentDisplayCount} Reviews</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Student reviews count</p>
                            </TooltipContent>
                          </Tooltip>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comment Button */}
                  <Button 
                    variant="default" 
                    size="default" 
                    className="w-full bg-primary hover:bg-primary/90 hover:-translate-y-1 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => setSelectedSchool(school)}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    View Comments
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No schools found matching your filters</p>
          </div>
        )}
      </main>

      {/* Reviews Modal */}
      <Dialog
        open={!!selectedSchool}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSchool(null);
            setReviewText("");
            setReviewRating(0);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSchool?.name} - Student Reviews</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedSchool?.reviews.map((review, idx) => (
              <Card key={`${review.name}-${review.date}-${idx}`}>
                <CardContent className="pt-6">
                  {editingReviewIndex === idx ? (
                    // 編輯模式
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium">{review.name}</span>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              className="transition-colors text-muted-foreground hover:text-primary"
                              onClick={() => setEditingReviewRating(value)}
                              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  editingReviewRating >= value ? "fill-primary text-primary" : ""
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        value={editingReviewText}
                        onChange={(e) => setEditingReviewText(e.target.value)}
                        className="mb-3 min-h-[80px]"
                      />
                      <div className="flex items-center justify-end gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleSaveEdit(idx)}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    // 顯示模式
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium">{review.name}</span>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{review.content}</p>
                      {review.isUser && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 hover:bg-green-600 hover:text-white hover:border-green-600"
                            onClick={() => handleEditReview(idx)}
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => handleDeleteReview(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  {editingReviewIndex !== null ? "Edit Your Review" : "Share Your Experience"}
                </h3>
                {editingReviewIndex !== null && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Your Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="transition-colors text-muted-foreground hover:text-primary"
                      onClick={() => setReviewRating(value)}
                      aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          reviewRating >= value ? "fill-primary text-primary" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mb-3"
              />
              <Button 
                onClick={editingReviewIndex !== null ? handleUpdateReview : handlePostReview} 
                className="w-full"
              >
                {editingReviewIndex !== null ? "Update Review" : "Post Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisualSchoolExplorer;
