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

const presetDurations = [25, 15, 5];

const FocusModeDashboard = () => {
  const [selectedTime, setSelectedTime] = useState<number | null>(presetDurations[0]);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [customTime, setCustomTime] = useState(10); // 單位：分鐘，預設10
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
      const duration = showCustomTimer ? customTime : selectedTime;
      setTimeLeft(duration * 60);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = showCustomTimer ? customTime : selectedTime;
    setTimeLeft(duration * 60);
  };


  const handlePresetChange = (minutes: number) => {
    setSelectedTime(minutes);
    setShowCustomTimer(false);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleCustomClick = () => {
    setShowCustomTimer(true);
    setSelectedTime(null);
    setCustomTime(10);
    setTimeLeft(10 * 60);
    setIsRunning(false);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 0) value = 1;
    setCustomTime(value);
    setTimeLeft(value * 60);
    setIsRunning(false);
  };

  const handleCycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const TimerIcon = isRunning ? Pause : Play;
  const currentQuote = motivationalQuotes[quoteIndex];

  useEffect(() => {
    // 禁用頁面滾動
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // 清理：恢復滾動
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div
        className="fixed inset-0 overflow-hidden text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,18,38,0.88) 0%, rgba(8,18,38,0.75) 40%, rgba(6,14,27,0.92) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(100,149,237,0.22),_transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,rgba(12,19,33,0)_0%,rgba(12,19,33,0.65)_45%,rgba(12,19,33,0.92)_100%)]" />

      <div className="absolute inset-0 z-10 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0">
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

        <main className="flex flex-1 items-center justify-center px-6 overflow-hidden">
          <div className="w-full max-w-xl space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Focus Session</p>
              <div className="text-[4.5rem] font-semibold leading-none tracking-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                {formattedTime}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="default"
                  onClick={handleToggle}
                  className="flex items-center gap-2 rounded-full bg-white/20 px-8 text-base font-semibold text-white backdrop-blur hover:bg-white/30"
                >
                  <TimerIcon className="h-4 w-4" />
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-full border-white/40 bg-white/10 px-8 text-base font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>


            <div className="flex flex-wrap justify-center gap-2">
              {presetDurations.map((minutes) => (
                <Button
                  key={minutes}
                  variant={selectedTime === minutes && !showCustomTimer ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePresetChange(minutes)}
                  className={`rounded-full border border-white/30 px-4 text-sm font-medium backdrop-blur transition ${
                    selectedTime === minutes && !showCustomTimer
                      ? "bg-white text-slate-900 hover:bg-white"
                      : "bg-white/10 text-white hover:bg-white/25"
                  }`}
                >
                  {minutes} min
                </Button>
              ))}
              <Button
                variant={showCustomTimer ? "default" : "ghost"}
                size="sm"
                onClick={handleCustomClick}
                className={`rounded-full border border-white/30 px-4 text-sm font-medium backdrop-blur transition ${
                  showCustomTimer
                    ? "bg-white text-slate-900 hover:bg-white"
                    : "bg-white/10 text-white hover:bg-white/25"
                }`}
              >
                Custom
              </Button>
            </div>

            {showCustomTimer && (
              <div className="flex justify-center mt-2">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={customTime}
                  onChange={handleCustomTimeChange}
                  className="w-24 rounded-full px-3 py-1.5 text-center text-base font-semibold text-slate-900 bg-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="ml-2 text-white/80 self-center">分鐘</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-base font-medium text-white/90">"{currentQuote}"</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCycleQuote}
                className="text-xs text-white/70 hover:text-white"
              >
                Refresh quote
              </Button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span className="flex items-center gap-2">
                <span>Is your device in</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/90">
                  <BellOff className="h-3 w-3" />
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
