import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, RefreshCw, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const motivationalQuotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "Focus is the gateway to success. - Unknown",
  "Quality is not an act, it is a habit. - Aristotle",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
];

const FocusModeDashboard = () => {
  const [selectedTime, setSelectedTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [showRitualModal, setShowRitualModal] = useState(false);
  const [hideRitualToday, setHideRitualToday] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionMood, setReflectionMood] = useState(0);
  const [reflectionNote, setReflectionNote] = useState("");
  const [distractionFreeMode, setDistractionFreeMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      toast.success("Great job! Take a short break (5 min).");
      setTimeout(() => setShowReflection(true), 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Keyboard shortcut for distraction-free mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setDistractionFreeMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleStart = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (!hideRitualToday && timeLeft === selectedTime * 60) {
        setShowRitualModal(true);
      } else {
        setIsRunning(true);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
  };

  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleRefreshQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  const handleSubmitReflection = () => {
    if (reflectionMood > 0) {
      toast.success("Reflection saved!");
      setShowReflection(false);
      setReflectionMood(0);
      setReflectionNote("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100;

  return (
    <div className={`min-h-screen bg-background ${distractionFreeMode ? 'pb-8' : ''}`}>
      {!distractionFreeMode && <Navigation />}
      
      <main className="container py-8">
        {!distractionFreeMode && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Focus Mode</h1>
              <p className="text-lg text-muted-foreground">
                Stay focused with Pomodoro-style study sessions
              </p>
            </div>

            {/* Motivational Quote */}
            {showQuote && (
              <Card className="mb-8 bg-primary-light border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <p className="text-sm italic flex-1">{currentQuote}</p>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefreshQuote}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuote(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Timer Section */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8 pb-8">
              {/* Time Presets */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[25, 45, 60].map((time) => (
                  <Badge
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-base"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time} min
                  </Badge>
                ))}
              </div>

              {/* Timer Display */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <svg className="w-64 h-64 transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleStart}>
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Distraction-Free Mode Toggle */}
              {!distractionFreeMode && (
                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDistractionFreeMode(true)}
                  >
                    Enable Distraction-Free Mode (F)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Summary */}
          {!distractionFreeMode && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Daily Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">Goals Planned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">2</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">1</p>
                    <p className="text-sm text-muted-foreground">Spillover</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Focus Ritual Modal */}
      <Dialog open={showRitualModal} onOpenChange={setShowRitualModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Before You Start</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>Is your phone on Do Not Disturb?</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>Are notifications turned off?</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="hideToday"
                checked={hideRitualToday}
                onChange={(e) => setHideRitualToday(e.target.checked)}
              />
              <label htmlFor="hideToday" className="text-sm">Hide for today</label>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowRitualModal(false);
                setIsRunning(true);
              }}
            >
              Start Focusing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reflection Modal */}
      <Dialog open={showReflection} onOpenChange={setShowReflection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Reflection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">How do you feel?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Button
                    key={mood}
                    variant={reflectionMood === mood ? "default" : "outline"}
                    size="lg"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setReflectionMood(mood)}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Notes (optional, max 140 chars)</p>
              <Textarea
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value.slice(0, 140))}
                placeholder="Any thoughts about this session?"
                maxLength={140}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reflectionNote.length}/140
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowReflection(false)}
              >
                Skip
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitReflection}
                disabled={reflectionMood === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Distraction-Free Exit Hint */}
      {distractionFreeMode && (
        <div className="fixed bottom-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDistractionFreeMode(false)}
          >
            Exit Distraction-Free Mode (F)
          </Button>
        </div>
      )}
    </div>
  );
};

export default FocusModeDashboard;
