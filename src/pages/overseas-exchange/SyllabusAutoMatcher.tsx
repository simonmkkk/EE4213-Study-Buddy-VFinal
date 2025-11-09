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

interface Course {
  code: string;
  name: string;
  credits: number;
  transferable: boolean;
  matchText?: string;
  keywords: string[];
}

const schoolNameMap: Record<string, string> = {
  eth: "ETH Zurich",
  tum: "TU Munich",
  nus: "National University of Singapore",
  uoft: "University of Toronto",
  oxford: "University of Oxford",
  mit: "Massachusetts Institute of Technology",
  utokyo: "University of Tokyo",
  melbourne: "University of Melbourne",
  hec: "HEC Paris",
  snu: "Seoul National University",
};

const schoolMajors: Record<string, { value: string; label: string }[]> = {
  eth: [
    { value: "cs", label: "Computer Science" },
    { value: "electrical", label: "Electrical Engineering" },
    { value: "math", label: "Mathematics" },
    { value: "datascience", label: "Data Science" },
  ],
  tum: [
    { value: "mechanical", label: "Mechanical Engineering" },
    { value: "aerospace", label: "Aerospace Engineering" },
    { value: "robotics", label: "Robotics" },
    { value: "industrial", label: "Industrial Engineering" },
  ],
  nus: [
    { value: "businessadmin", label: "Business Administration" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" },
    { value: "infosystems", label: "Information Systems" },
  ],
  uoft: [
    { value: "medicine", label: "Medicine" },
    { value: "biomedical", label: "Biomedical Sciences" },
    { value: "publichealth", label: "Public Health" },
    { value: "neuroscience", label: "Neuroscience" },
  ],
  oxford: [
    { value: "law", label: "Law" },
    { value: "intlrelations", label: "International Relations" },
    { value: "philosophy", label: "Philosophy" },
    { value: "publicpolicy", label: "Public Policy" },
  ],
  mit: [
    { value: "cs", label: "Computer Science" },
    { value: "physics", label: "Physics" },
    { value: "aerospace", label: "Aerospace Engineering" },
    { value: "ai", label: "Artificial Intelligence" },
  ],
  utokyo: [
    { value: "materialsscience", label: "Materials Science" },
    { value: "computerengineering", label: "Computer Engineering" },
    { value: "architecture", label: "Architecture" },
    { value: "robotics", label: "Robotics" },
  ],
  melbourne: [
    { value: "environmentalscience", label: "Environmental Science" },
    { value: "medicine", label: "Medicine" },
    { value: "dataanalytics", label: "Data Analytics" },
    { value: "business", label: "Business" },
  ],
  hec: [
    { value: "businessadmin", label: "Business Administration" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "finance", label: "Finance" },
    { value: "luxury", label: "Luxury Management" },
  ],
  snu: [
    { value: "cs", label: "Computer Science" },
    { value: "bioengineering", label: "Bioengineering" },
    { value: "economics", label: "Economics" },
    { value: "design", label: "Design" },
  ],
};

const mockCourses: Record<string, Course[]> = {
  "eth-cs": [
    { code: "ETH-CS310", name: "AI for Autonomous Systems", credits: 6, transferable: true, matchText: "Matches CS450 - Intelligent Systems", keywords: ["AI", "Robotics"] },
    { code: "ETH-CS325", name: "Distributed Computing", credits: 5, transferable: true, matchText: "Matches CS360 - Distributed Systems", keywords: ["Distributed Systems", "Cloud"] },
  ],
  "eth-electrical": [
    { code: "ETH-EE220", name: "Power Electronics", credits: 5, transferable: true, matchText: "Matches EE320 - Power Systems", keywords: ["Power", "Circuits"] },
    { code: "ETH-EE340", name: "Embedded Control Systems", credits: 6, transferable: false, keywords: ["Embedded", "Control"] },
  ],
  "eth-math": [
    { code: "ETH-MTH210", name: "Advanced Linear Algebra", credits: 5, transferable: true, matchText: "Matches MA210 - Linear Algebra II", keywords: ["Matrix", "Vector"] },
    { code: "ETH-MTH330", name: "Numerical Analysis", credits: 4, transferable: true, matchText: "Matches MA330 - Numerical Methods", keywords: ["Numerical", "Computation"] },
  ],
  "eth-datascience": [
    { code: "ETH-DS200", name: "Applied Machine Learning", credits: 5, transferable: true, matchText: "Matches DS300 - Applied ML", keywords: ["ML", "Data"] },
    { code: "ETH-DS315", name: "Big Data Systems", credits: 4, transferable: false, keywords: ["Big Data", "Analytics"] },
  ],
  "tum-mechanical": [
    { code: "TUM-ME210", name: "Thermodynamics II", credits: 5, transferable: true, matchText: "Matches ME230 - Thermodynamics", keywords: ["Thermo", "Energy"] },
    { code: "TUM-ME340", name: "Advanced CAD Design", credits: 4, transferable: true, matchText: "Matches ME340 - CAD/CAE", keywords: ["CAD", "Design"] },
  ],
  "tum-aerospace": [
    { code: "TUM-AE320", name: "Flight Mechanics", credits: 6, transferable: true, matchText: "Matches AE320 - Flight Mechanics", keywords: ["Flight", "Dynamics"] },
    { code: "TUM-AE350", name: "Space Systems", credits: 5, transferable: false, keywords: ["Space", "Systems"] },
  ],
  "tum-robotics": [
    { code: "TUM-RB200", name: "Robotics Programming", credits: 5, transferable: true, matchText: "Matches CS360 - Robotics Programming", keywords: ["Robotics", "Programming"] },
    { code: "TUM-RB320", name: "Autonomous Navigation", credits: 4, transferable: true, matchText: "Matches CS420 - Autonomous Systems", keywords: ["Navigation", "AI"] },
  ],
  "tum-industrial": [
    { code: "TUM-IE210", name: "Operations Research", credits: 5, transferable: true, matchText: "Matches IE310 - Operations Research", keywords: ["Optimization", "Operations"] },
    { code: "TUM-IE330", name: "Lean Manufacturing", credits: 4, transferable: false, keywords: ["Lean", "Manufacturing"] },
  ],
  "nus-businessadmin": [
    { code: "NUS-MG220", name: "Innovation Strategy", credits: 4, transferable: true, matchText: "Matches MG220 - Innovation Strategy", keywords: ["Innovation", "Strategy"] },
    { code: "NUS-MG325", name: "Global Leadership", credits: 4, transferable: false, keywords: ["Leadership", "Global"] },
  ],
  "nus-finance": [
    { code: "NUS-FIN310", name: "Emerging Markets Finance", credits: 4, transferable: true, matchText: "Matches FIN310 - Emerging Markets", keywords: ["Finance", "Markets"] },
    { code: "NUS-FIN360", name: "Sustainable Investing", credits: 4, transferable: true, matchText: "Matches FIN360 - Sustainable Finance", keywords: ["Sustainability", "Investing"] },
  ],
  "nus-marketing": [
    { code: "NUS-MKT330", name: "Digital Consumer Insights", credits: 4, transferable: true, matchText: "Matches MKT340 - Consumer Analytics", keywords: ["Digital", "Analytics"] },
    { code: "NUS-MKT380", name: "Brand Storytelling", credits: 3, transferable: false, keywords: ["Brand", "Storytelling"] },
  ],
  "nus-infosystems": [
    { code: "NUS-IS210", name: "Enterprise Data Systems", credits: 4, transferable: true, matchText: "Matches IS320 - Enterprise Systems", keywords: ["Enterprise", "Data"] },
    { code: "NUS-IS340", name: "Cloud Architecture", credits: 4, transferable: true, matchText: "Matches CS350 - Cloud Architecture", keywords: ["Cloud", "Architecture"] },
  ],
  "uoft-medicine": [
    { code: "UOFT-MED310", name: "Advanced Clinical Practice", credits: 5, transferable: true, matchText: "Matches MED410 - Clinical Practice", keywords: ["Clinical", "Practice"] },
    { code: "UOFT-MED330", name: "Medical Ethics", credits: 3, transferable: true, matchText: "Matches MED330 - Medical Ethics", keywords: ["Ethics", "Medicine"] },
  ],
  "uoft-biomedical": [
    { code: "UOFT-BME220", name: "Biomedical Instrumentation", credits: 4, transferable: true, matchText: "Matches BME320 - Instrumentation", keywords: ["Biomedical", "Instrumentation"] },
    { code: "UOFT-BME340", name: "Tissue Engineering", credits: 4, transferable: false, keywords: ["Tissue", "Engineering"] },
  ],
  "uoft-publichealth": [
    { code: "UOFT-PH200", name: "Global Health Policy", credits: 4, transferable: true, matchText: "Matches PH300 - Global Health", keywords: ["Policy", "Global Health"] },
    { code: "UOFT-PH320", name: "Epidemiology Methods", credits: 4, transferable: true, matchText: "Matches PH320 - Epidemiology", keywords: ["Epidemiology", "Data"] },
  ],
  "uoft-neuroscience": [
    { code: "UOFT-NEU210", name: "Neural Systems", credits: 4, transferable: true, matchText: "Matches NEU310 - Systems Neuroscience", keywords: ["Neural", "Systems"] },
    { code: "UOFT-NEU330", name: "Cognitive Neuroscience", credits: 4, transferable: false, keywords: ["Cognitive", "Brain"] },
  ],
  "oxford-law": [
    { code: "OXF-LAW300", name: "Comparative Constitutional Law", credits: 4, transferable: true, matchText: "Matches LAW320 - Comparative Law", keywords: ["Constitutional", "Comparative"] },
    { code: "OXF-LAW340", name: "Human Rights Advocacy", credits: 3, transferable: true, matchText: "Matches LAW360 - Human Rights", keywords: ["Human Rights", "Advocacy"] },
  ],
  "oxford-intlrelations": [
    { code: "OXF-IR310", name: "Global Governance", credits: 4, transferable: true, matchText: "Matches IR320 - Global Governance", keywords: ["Governance", "Global"] },
    { code: "OXF-IR360", name: "Diplomacy in Practice", credits: 3, transferable: false, keywords: ["Diplomacy", "Practice"] },
  ],
  "oxford-philosophy": [
    { code: "OXF-PHIL210", name: "Ethics of Technology", credits: 4, transferable: true, matchText: "Matches PHI320 - Ethics", keywords: ["Ethics", "Technology"] },
    { code: "OXF-PHIL330", name: "Political Philosophy", credits: 4, transferable: true, matchText: "Matches PHI340 - Political Philosophy", keywords: ["Political", "Philosophy"] },
  ],
  "oxford-publicpolicy": [
    { code: "OXF-PP320", name: "Urban Policy Innovation", credits: 4, transferable: true, matchText: "Matches PP320 - Urban Policy", keywords: ["Urban", "Policy"] },
    { code: "OXF-PP360", name: "Public Finance", credits: 3, transferable: false, keywords: ["Public", "Finance"] },
  ],
  "mit-physics": [
    { code: "MIT8.311", name: "Electromagnetism II", credits: 6, transferable: true, matchText: "Matches PHY330 - Electromagnetism", keywords: ["Physics", "Electromagnetism"] },
    { code: "MIT8.321", name: "Quantum Theory", credits: 6, transferable: true, matchText: "Matches PHY420 - Quantum Mechanics", keywords: ["Quantum", "Physics"] },
  ],
  "mit-aerospace": [
    { code: "MIT16.100", name: "Aerodynamics", credits: 6, transferable: true, matchText: "Matches AE320 - Aerodynamics", keywords: ["Aerodynamics", "Flight"] },
    { code: "MIT16.120", name: "Space Propulsion", credits: 5, transferable: false, keywords: ["Space", "Propulsion"] },
  ],
  "mit-ai": [
    { code: "MIT6.864", name: "Advanced Machine Learning", credits: 6, transferable: true, matchText: "Matches CS460 - Advanced ML", keywords: ["ML", "Advanced"] },
    { code: "MIT6.861", name: "Computational Vision", credits: 6, transferable: true, matchText: "Matches CS480 - Computer Vision", keywords: ["Vision", "AI"] },
  ],
  "utokyo-materialsscience": [
    { code: "UTK-MS210", name: "Nano Materials", credits: 4, transferable: true, matchText: "Matches MS320 - Nanomaterials", keywords: ["Nano", "Materials"] },
    { code: "UTK-MS330", name: "Smart Materials", credits: 4, transferable: false, keywords: ["Smart", "Materials"] },
  ],
  "utokyo-computerengineering": [
    { code: "UTK-CE220", name: "VLSI Design", credits: 4, transferable: true, matchText: "Matches CE330 - VLSI", keywords: ["VLSI", "Design"] },
    { code: "UTK-CE340", name: "Embedded AI Systems", credits: 4, transferable: true, matchText: "Matches CE360 - Embedded AI", keywords: ["Embedded", "AI"] },
  ],
  "utokyo-architecture": [
    { code: "UTK-AR200", name: "Urban Architecture Studio", credits: 5, transferable: true, matchText: "Matches AR310 - Urban Studio", keywords: ["Urban", "Studio"] },
    { code: "UTK-AR320", name: "Sustainable Building Design", credits: 4, transferable: true, matchText: "Matches AR330 - Sustainable Design", keywords: ["Sustainable", "Design"] },
  ],
  "utokyo-robotics": [
    { code: "UTK-RB210", name: "Humanoid Robotics", credits: 4, transferable: true, matchText: "Matches RB320 - Humanoid Systems", keywords: ["Humanoid", "Robotics"] },
    { code: "UTK-RB330", name: "Motion Planning", credits: 4, transferable: false, keywords: ["Motion", "Planning"] },
  ],
  "melbourne-environmentalscience": [
    { code: "MELB-ENV210", name: "Climate Risk Assessment", credits: 4, transferable: true, matchText: "Matches ENVS310 - Climate Risk", keywords: ["Climate", "Risk"] },
    { code: "MELB-ENV320", name: "Sustainable Ecosystems", credits: 4, transferable: true, matchText: "Matches ENVS320 - Ecosystems", keywords: ["Ecosystems", "Sustainability"] },
  ],
  "melbourne-medicine": [
    { code: "MELB-MED320", name: "Advanced Clinical Simulation", credits: 5, transferable: true, matchText: "Matches MED420 - Clinical Simulation", keywords: ["Simulation", "Clinical"] },
    { code: "MELB-MED340", name: "Global Health Practicum", credits: 4, transferable: false, keywords: ["Global Health", "Practicum"] },
  ],
  "melbourne-dataanalytics": [
    { code: "MELB-DA210", name: "Data Visualization", credits: 4, transferable: true, matchText: "Matches DA310 - Data Visualization", keywords: ["Visualization", "Analytics"] },
    { code: "MELB-DA330", name: "Predictive Analytics", credits: 4, transferable: true, matchText: "Matches DA320 - Predictive Analytics", keywords: ["Predictive", "Analytics"] },
  ],
  "melbourne-business": [
    { code: "MELB-BUS310", name: "Asia-Pacific Business", credits: 4, transferable: true, matchText: "Matches BUS410 - International Business", keywords: ["International", "Asia-Pacific"] },
    { code: "MELB-BUS340", name: "Business Analytics", credits: 4, transferable: false, keywords: ["Analytics", "Business"] },
  ],
  "hec-businessadmin": [
    { code: "HEC-MG300", name: "Strategic Management", credits: 4, transferable: true, matchText: "Matches MG410 - Strategy", keywords: ["Strategy", "Management"] },
    { code: "HEC-MG340", name: "Change Leadership", credits: 4, transferable: true, matchText: "Matches MG430 - Change Management", keywords: ["Change", "Leadership"] },
  ],
  "hec-entrepreneurship": [
    { code: "HEC-ENT320", name: "Startup Financing", credits: 4, transferable: true, matchText: "Matches ENT320 - Venture Finance", keywords: ["Startup", "Finance"] },
    { code: "HEC-ENT350", name: "Innovation Lab", credits: 3, transferable: false, keywords: ["Innovation", "Lab"] },
  ],
  "hec-finance": [
    { code: "HEC-FIN330", name: "Corporate Valuation", credits: 4, transferable: true, matchText: "Matches FIN430 - Valuation", keywords: ["Valuation", "Corporate"] },
    { code: "HEC-FIN360", name: "Risk Analytics", credits: 4, transferable: true, matchText: "Matches FIN440 - Risk Management", keywords: ["Risk", "Analytics"] },
  ],
  "hec-luxury": [
    { code: "HEC-LUX310", name: "Luxury Branding", credits: 4, transferable: true, matchText: "Matches MKT420 - Luxury Branding", keywords: ["Luxury", "Branding"] },
    { code: "HEC-LUX330", name: "Retail Experience Design", credits: 3, transferable: false, keywords: ["Retail", "Experience"] },
  ],
  "snu-cs": [
    { code: "SNU-CS320", name: "Data Mining", credits: 4, transferable: true, matchText: "Matches CS340 - Data Mining", keywords: ["Data", "Mining"] },
    { code: "SNU-CS340", name: "Blockchain Platforms", credits: 4, transferable: false, keywords: ["Blockchain", "Platforms"] },
  ],
  "snu-bioengineering": [
    { code: "SNU-BIO300", name: "Bioinformatics", credits: 4, transferable: true, matchText: "Matches BIO320 - Bioinformatics", keywords: ["Bioinformatics", "Genomics"] },
    { code: "SNU-BIO340", name: "Biomaterials", credits: 4, transferable: false, keywords: ["Biomaterials", "Design"] },
  ],
  "snu-economics": [
    { code: "SNU-ECON310", name: "Asian Economic Policy", credits: 4, transferable: true, matchText: "Matches ECON420 - Economic Policy", keywords: ["Policy", "Asia"] },
    { code: "SNU-ECON340", name: "Development Economics", credits: 4, transferable: true, matchText: "Matches ECON340 - Development Economics", keywords: ["Development", "Economics"] },
  ],
  "snu-design": [
    { code: "SNU-DES210", name: "Interaction Design", credits: 4, transferable: true, matchText: "Matches DES320 - Interaction Design", keywords: ["Interaction", "Design"] },
    { code: "SNU-DES330", name: "Service Innovation Studio", credits: 3, transferable: false, keywords: ["Service", "Innovation"] },
  ],
};

const baseMajorOption = { value: "all", label: "All Majors" };

const majorLabelMap = Object.values(schoolMajors).reduce<Record<string, string>>((acc, majors) => {
  majors.forEach(({ value, label }) => {
    acc[value] = label;
  });
  return acc;
}, {});

const getAvailableMajorOptions = (school: string | null | undefined) => {
  if (!school || !schoolMajors[school]) {
    const uniqueMajors = Array.from(new Map(Object.values(schoolMajors).flat().map((item) => [item.value, item])).values());
    return [baseMajorOption, ...uniqueMajors];
  }
  return [baseMajorOption, ...schoolMajors[school]];
};

const SyllabusAutoMatcher = () => {
  const location = useLocation();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (location.state?.schoolId) {
      setSelectedSchool(location.state.schoolId);
    }
  }, [location.state]);

  useEffect(() => {
    if (!selectedSchool) {
      return;
    }

    const availableMajorsForSchool = getAvailableMajorOptions(selectedSchool).map((option) => option.value);

    if (!availableMajorsForSchool.includes(selectedMajor)) {
      setSelectedMajor("all");
    }
  }, [selectedSchool, selectedMajor]);

  useEffect(() => {
    if (selectedSchool) {
      if (selectedMajor === "all") {
        const schoolCourses = Object.keys(mockCourses)
          .filter((key) => key.startsWith(`${selectedSchool}-`))
          .flatMap((key) => mockCourses[key]);
        setCourses(schoolCourses);
      } else if (selectedMajor) {
        const key = `${selectedSchool}-${selectedMajor.toLowerCase().replace(/\s+/g, "")}`;
        setCourses(mockCourses[key] || []);
      } else {
        setCourses([]);
      }
    } else {
      setCourses([]);
    }
  }, [selectedSchool, selectedMajor]);

  const stats = {
    total: courses.length,
    transferable: courses.filter(c => c.transferable).length,
    credits: `${courses.filter(c => c.transferable).reduce((sum, c) => sum + c.credits, 0)}/${courses.reduce((sum, c) => sum + c.credits, 0)}`,
  };

  const showInlineStats = Boolean(location.state?.schoolId && selectedSchool && selectedMajor);

  const statsSummaryContent = (
    <div className="flex flex-wrap gap-2 text-sm">
      <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 shadow-sm">
        <div className="p-1.5 rounded-md bg-primary-light">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Courses</p>
          <p className="text-base font-semibold">{stats.total}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 shadow-sm">
        <div className="p-1.5 rounded-md bg-accent-light">
          <CheckCircle2 className="h-4 w-4 text-accent" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Transfer Eligible</p>
          <p className="text-base font-semibold">{stats.transferable}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 shadow-sm">
        <div className="p-1.5 rounded-md bg-secondary-light">
          <Trophy className="h-4 w-4 text-secondary" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Eligible Credits</p>
          <p className="text-base font-semibold">{stats.credits}</p>
        </div>
      </div>
    </div>
  );

  const schoolNameMap: Record<string, string> = {
    eth: "ETH Zurich",
    tum: "TU Munich",
    nus: "National University of Singapore",
    mit: "Massachusetts Institute of Technology",
    utokyo: "University of Tokyo",
    melbourne: "University of Melbourne",
    hec: "HEC Paris",
    snu: "Seoul National University",
  };

  const schoolName = selectedSchool ? schoolNameMap[selectedSchool] ?? "Select a school" : "Select a school";

  const availableMajorOptions = getAvailableMajorOptions(selectedSchool);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Syllabus Auto-Matcher</h1>
          <p className="text-lg text-muted-foreground">
            Automatically match courses with your home institution
          </p>
        </div>

        {/* School Selection */}
        {location.state?.schoolId ? (
          <div className="mb-8">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Selected School</p>
                  <h2 className="text-3xl font-semibold text-foreground">{schoolName}</h2>
                </div>
                <div className="w-full sm:w-[250px]">
                  <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a major..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {showInlineStats && <div className="self-start">{statsSummaryContent}</div>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Choose a school..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth">ETH Zurich</SelectItem>
                <SelectItem value="tum">TU Munich</SelectItem>
                <SelectItem value="nus">National University of Singapore</SelectItem>
                <SelectItem value="uoft">University of Toronto</SelectItem>
                <SelectItem value="oxford">University of Oxford</SelectItem>
                <SelectItem value="mit">Massachusetts Institute of Technology</SelectItem>
                <SelectItem value="utokyo">University of Tokyo</SelectItem>
                <SelectItem value="melbourne">University of Melbourne</SelectItem>
                <SelectItem value="hec">HEC Paris</SelectItem>
                <SelectItem value="snu">Seoul National University</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMajor} onValueChange={setSelectedMajor}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Choose a major..." />
              </SelectTrigger>
              <SelectContent>
                {availableMajorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!selectedSchool || !selectedMajor ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Select a school and major to get started</p>
          </div>
        ) : (
          <>
            {/* Statistics Summary */}
            {!showInlineStats && (
              <div className="flex justify-end mb-6">
                {statsSummaryContent}
              </div>
            )}

            {/* Course List Title */}
            <h2 className="text-2xl font-bold mb-6">
              {(selectedMajor === "all" ? "All Majors" : majorLabelMap[selectedMajor] ?? selectedMajor)} Courses at {schoolName}
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
