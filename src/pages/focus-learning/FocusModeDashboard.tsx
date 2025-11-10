import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RefreshCw, BellOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const motivationalQuotes = [
  "The successful warrior is the average person, with laser-like focus.",
  "Do something today that your future self will thank you for.",
  "Small daily improvements are the key to long-term results.",
  "Your focus determines your reality.",
  "Distraction is the enemy of progress.",
];

const presetDurations = [25, 5, 15];

const FocusModeDashboard = () => {
  const [selectedTime, setSelectedTime] = useState(presetDurations[0]);
  const [timeLeft, setTimeLeft] = useState(presetDurations[0] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }
  }, [timeLeft]);

  useEffect(() => {
    const quoteTimer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 20000);

    return () => window.clearInterval(quoteTimer);
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const handleToggle = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedTime * 60);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
  };

  const handlePresetChange = (minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleCycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const TimerIcon = isRunning ? Pause : Play;
  const currentQuote = motivationalQuotes[quoteIndex];

  return (
    <div
        className="relative min-h-screen overflow-hidden text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,18,38,0.88) 0%, rgba(8,18,38,0.75) 40%, rgba(6,14,27,0.92) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(100,149,237,0.22),_transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,rgba(12,19,33,0)_0%,rgba(12,19,33,0.65)_45%,rgba(12,19,33,0.92)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col pb-12">
        <header className="flex items-center justify-between px-6 py-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/focus-learning')} className="gap-2 text-white/90">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="hidden sm:inline">Stay focused</span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-xl space-y-12 text-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">Focus Session</p>
              <div className="text-[6.5rem] font-semibold leading-none tracking-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                {formattedTime}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleToggle}
                  className="flex items-center gap-2 rounded-full bg-white/20 px-10 text-lg font-semibold text-white backdrop-blur hover:bg-white/30"
                >
                  <TimerIcon className="h-5 w-5" />
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-full border-white/40 bg-white/10 px-10 text-lg font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {presetDurations.map((minutes) => (
                <Button
                  key={minutes}
                  variant={selectedTime === minutes ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePresetChange(minutes)}
                  className={`rounded-full border border-white/30 px-5 text-sm font-medium backdrop-blur transition ${
                    selectedTime === minutes
                      ? "bg-white text-slate-900 hover:bg-white"
                      : "bg-white/10 text-white hover:bg-white/25"
                  }`}
                >
                  {minutes} min
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-lg font-medium text-white/90">“{currentQuote}”</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCycleQuote}
                className="text-sm text-white/70 hover:text-white"
              >
                Refresh quote
              </Button>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full bg-black/20 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              <span className="flex items-center gap-2">
                <span>Is your device in</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  <BellOff className="h-3.5 w-3.5" />
                  Do Not Disturb Mode
                </span>
                <span>?</span>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FocusModeDashboard;
