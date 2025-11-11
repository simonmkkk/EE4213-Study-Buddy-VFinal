import { useEffect, useMemo, useRef, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Image as ImageIcon,
  Minimize2,
  CloudRain,
  Waves,
  Trees,
  Flame,
  Coffee,
  Wind,
  Trash2,
  X,
  Check,
  Undo2,
  CalendarCheck,
  MoreVertical,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

interface MinorTask {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
}

interface MajorTask {
  id: string;
  title: string;
  minors: MinorTask[];
  completedAt?: string;
  deadline?: string;
}

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const defaultMajorTasks: MajorTask[] = [
  {
    id: createId(),
    title: "Prepare Algorithms Midterm",
    minors: [
      { id: createId(), title: "Review lecture slides", completed: false },
      { id: createId(), title: "Practice dynamic programming problems", completed: false },
      { id: createId(), title: "Summarize key formulas", completed: false },
    ],
  },
  {
    id: createId(),
    title: "Design UX Case Study",
    minors: [
      { id: createId(), title: "Outline user persona", completed: true },
      { id: createId(), title: "Draft journey map", completed: false },
      { id: createId(), title: "Prepare presentation slides", completed: false },
    ],
  },
];

const defaultCompletionHistory: Record<string, number> = (() => {
  const history: Record<string, number> = {};
  const markDay = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    history[date.toISOString().slice(0, 10)] = 1;
  };
  markDay(2);
  markDay(5);
  return history;
})();

const wallpapers = [
  { value: "default", label: "Default (No wallpaper)", url: "" },
  {
    value: "coast",
    label: "Sunset Coast",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
  },
  {
    value: "forest",
    label: "Misty Forest",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=80",
  },
  {
    value: "city",
    label: "Midnight City",
    url: "https://images.unsplash.com/photo-1526402466225-2749496cb138?auto=format&fit=crop&w=2000&q=80",
  },
];

const ambientTracks = [
  {
    value: "rain",
    label: "Rain",
    icon: CloudRain,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2390.mp3",
  },
  {
    value: "ocean",
    label: "Ocean Waves",
    icon: Waves,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-ocean-wave-loop-1193.mp3",
  },
  {
    value: "forest",
    label: "Forest",
    icon: Trees,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-forest-shore-ambience-1213.mp3",
  },
  {
    value: "fire",
    label: "Crackling Fire",
    icon: Flame,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3",
  },
  {
    value: "coffee",
    label: "Coffee Shop",
    icon: Coffee,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-187.mp3",
  },
  {
    value: "white-noise",
    label: "White Noise",
    icon: Wind,
    url: "https://assets.mixkit.co/sfx/preview/mixkit-white-noise-2861.mp3",
  },
];

const presetDurations = [25, 15, 5];

const FocusLearning = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>("default");
  const [selectedDuration, setSelectedDuration] = useState<number>(presetDurations[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAmbientPanelOpen, setIsAmbientPanelOpen] = useState<boolean>(false);
  const [isWallpaperPanelOpen, setIsWallpaperPanelOpen] = useState<boolean>(false);
  const [activeAmbientTrack, setActiveAmbientTrack] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(presetDurations[0] * 60);
  const [majorTasks, setMajorTasks] = useState<MajorTask[]>(defaultMajorTasks);
  const [newMajorTitle, setNewMajorTitle] = useState<string>("");
  const [newMajorDeadline, setNewMajorDeadline] = useState<string>("");
  const [newMinorInputs, setNewMinorInputs] = useState<Record<string, string>>({});
  const [newMinorDeadlines, setNewMinorDeadlines] = useState<Record<string, string>>({});
  const [completionHistory, setCompletionHistory] = useState<Record<string, number>>(defaultCompletionHistory);
  const [pastTasks, setPastTasks] = useState<MajorTask[]>([]);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(true);
  const [editingMajorIds, setEditingMajorIds] = useState<Record<string, string>>({});
  const [editingMajorDeadlines, setEditingMajorDeadlines] = useState<Record<string, string>>({});
  const [editingMinorIds, setEditingMinorIds] = useState<Record<string, Record<string, string>>>({});
  const [editingMinorDeadlines, setEditingMinorDeadlines] = useState<Record<string, Record<string, string>>>({});
  const [customHours, setCustomHours] = useState<number>(0);
  const [customMinutes, setCustomMinutes] = useState<number>(0);
  const [customSeconds, setCustomSeconds] = useState<number>(3);
  const [directTimeInput, setDirectTimeInput] = useState<string>("00:00:03");
  const [showCustomTimer, setShowCustomTimer] = useState<boolean>(false);
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const ambientAudioRef = useRef<Record<string, HTMLAudioElement>>({});
  const trackerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const highlightId = (location.state as { highlightId?: string } | null)?.highlightId;
    if (highlightId !== "focus-workshop-register") {
      return undefined;
    }

    setIsTrackerCollapsed(false);

    let highlightTimeout: number | undefined;
    const startTimeout = window.setTimeout(() => {
      const element = trackerRef.current;
      if (!element) {
        navigate(location.pathname, { replace: true });
        return;
      }

      element.classList.add("highlight-pulse");
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      highlightTimeout = window.setTimeout(() => {
        element.classList.remove("highlight-pulse");
        navigate(location.pathname, { replace: true });
      }, 1000);
    }, 120);

    return () => {
      window.clearTimeout(startTimeout);
      if (highlightTimeout) {
        window.clearTimeout(highlightTimeout);
      }
      trackerRef.current?.classList.remove("highlight-pulse");
    };
  }, [location, navigate]);

  const wallpaper = useMemo(
    () => wallpapers.find((item) => item.value === selectedWallpaper),
    [selectedWallpaper],
  );

  const backgroundStyle = wallpaper?.url
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(6,17,36,0.85) 0%, rgba(6,17,36,0.7) 40%, rgba(6,17,36,0.92) 100%), url('${wallpaper.url}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {
        backgroundColor: "#ffffff",
      };

  const isWallpaperActive = Boolean(wallpaper?.url);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const last7Days = useMemo(() => {
    const days: { dateKey: string; label: string; weekday: string; dayNumber: number }[] = [];
    const today = new Date();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setDate(today.getDate() - offset);
      const dateKey = date.toISOString().slice(0, 10);
      days.push({
        dateKey,
        label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
        dayNumber: date.getDate(),
      });
    }
    return days;
  }, []);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todaysCompletionCount = completionHistory[todayKey] ?? 0;

  const handlePresetSelect = (minutes: number) => {
    setSelectedDuration(minutes);
    setIsRunning(false);
    setRemainingSeconds(minutes * 60);
    setShowCustomTimer(false);
    setIsCustomSelected(false);
  };

  const updateCustomTime = (hours: number, minutes: number, seconds: number) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setSelectedDuration(totalSeconds / 60);
      setIsRunning(false);
      setRemainingSeconds(totalSeconds);
      setDirectTimeInput(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }
  };

  const handleDirectTimeInputChange = (value: string) => {
    setDirectTimeInput(value);
    
    // Auto-format as user types
    const cleaned = value.replace(/[^0-9]/g, "");
    
    if (cleaned.length >= 6) {
      const hours = parseInt(cleaned.slice(0, 2), 10);
      const minutes = parseInt(cleaned.slice(2, 4), 10);
      const seconds = parseInt(cleaned.slice(4, 6), 10);
      
      // Validate ranges
      if (hours <= 23 && minutes <= 59 && seconds <= 59) {
        setCustomHours(hours);
        setCustomMinutes(minutes);
        setCustomSeconds(seconds);
        updateCustomTime(hours, minutes, seconds);
      }
    }
  };

  const handleDirectTimeInputBlur = () => {
    // Format on blur to ensure proper display
    setDirectTimeInput(
      `${String(customHours).padStart(2, "0")}:${String(customMinutes).padStart(2, "0")}:${String(customSeconds).padStart(2, "0")}`
    );
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    } else {
      document.documentElement.requestFullscreen().catch(() => null);
    }
  };

  const toggleAmbientTrack = (trackValue: string) => {
    setActiveAmbientTrack((prev) => {
      const isActive = prev === trackValue;
      const nextTrack = isActive ? null : trackValue;

      if (prev) {
        const previousAudio = ambientAudioRef.current[prev];
        if (previousAudio) {
          previousAudio.pause();
          previousAudio.currentTime = 0;
        }
      }

      if (!isActive) {
        // Reset paused state when starting a new track
        setIsPaused(false);
        
        let audio = ambientAudioRef.current[trackValue];
        if (!audio) {
          const trackConfig = ambientTracks.find((track) => track.value === trackValue);
          if (trackConfig) {
            audio = new Audio(trackConfig.url);
            audio.loop = true;
            audio.volume = 0.6;
            ambientAudioRef.current[trackValue] = audio;
          }
        }

        if (audio && !isMuted && !isPaused) {
          void audio.play().catch(() => null);
        }
      }

      return nextTrack;
    });
  };

  const handleAddMajor = () => {
    const title = newMajorTitle.trim();
    if (!title) {
      return;
    }

    const newTask: MajorTask = {
      id: createId(),
      title,
      minors: [],
      deadline: newMajorDeadline || undefined,
    };

    setMajorTasks((prev) => [newTask, ...prev]);
    setNewMajorTitle("");
    setNewMajorDeadline("");
  };

  const handleAddMinor = (majorId: string) => {
    const value = (newMinorInputs[majorId] ?? "").trim();
    if (!value) {
      return;
    }

    const deadline = newMinorDeadlines[majorId] || undefined;

    setMajorTasks((prev) =>
      prev.map((major) =>
        major.id === majorId
          ? {
              ...major,
              minors: [...major.minors, { id: createId(), title: value, completed: false, deadline }],
            }
          : major,
      ),
    );

    setNewMinorInputs((prev) => ({ ...prev, [majorId]: "" }));
    setNewMinorDeadlines((prev) => ({ ...prev, [majorId]: "" }));
  };

  const handleStartEditMajor = (majorId: string, currentTitle: string, currentDeadline?: string) => {
    setEditingMajorIds((prev) => ({ ...prev, [majorId]: currentTitle }));
    setEditingMajorDeadlines((prev) => ({ ...prev, [majorId]: currentDeadline || "" }));
  };

  const handleEditMajorChange = (majorId: string, value: string) => {
    setEditingMajorIds((prev) => ({ ...prev, [majorId]: value }));
  };

  const handleCancelEditMajor = (majorId: string) => {
    setEditingMajorIds((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
    setEditingMajorDeadlines((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
    setEditingMinorIds((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSaveMajorTitle = (majorId: string) => {
    const nextTitle = (editingMajorIds[majorId] ?? "").trim();
    if (!nextTitle) {
      return;
    }

    const nextDeadline = editingMajorDeadlines[majorId] || undefined;

    setMajorTasks((prev) =>
      prev.map((major) => (major.id === majorId ? { ...major, title: nextTitle, deadline: nextDeadline } : major)),
    );

    handleCancelEditMajor(majorId);
    setEditingMinorIds((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleDeleteMajor = (majorId: string) => {
    setMajorTasks((prev) => prev.filter((major) => major.id !== majorId));
    setNewMinorInputs((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
    setEditingMajorIds((prev) => {
      const { [majorId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleDeleteMinor = (majorId: string, minorId: string) => {
    setMajorTasks((prev) =>
      prev.map((major) =>
        major.id === majorId
          ? {
              ...major,
              minors: major.minors.filter((minor) => minor.id !== minorId),
            }
          : major,
      ),
    );
    setEditingMinorIds((prev) => {
      const minorEdits = prev[majorId];
      if (!minorEdits) {
        return prev;
      }
      const { [minorId]: _removed, ...restMinors } = minorEdits;
      if (Object.keys(restMinors).length === 0) {
        const { [majorId]: _majorRemoved, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [majorId]: restMinors,
      };
    });
  };

  const handleStartEditMinor = (majorId: string, minorId: string, currentTitle: string, currentDeadline?: string) => {
    setEditingMinorIds((prev) => ({
      ...prev,
      [majorId]: {
        ...(prev[majorId] ?? {}),
        [minorId]: currentTitle,
      },
    }));
    setEditingMinorDeadlines((prev) => ({
      ...prev,
      [majorId]: {
        ...(prev[majorId] ?? {}),
        [minorId]: currentDeadline || "",
      },
    }));
  };

  const handleEditMinorChange = (majorId: string, minorId: string, value: string) => {
    setEditingMinorIds((prev) => ({
      ...prev,
      [majorId]: {
        ...(prev[majorId] ?? {}),
        [minorId]: value,
      },
    }));
  };

  const handleCancelEditMinor = (majorId: string, minorId: string) => {
    setEditingMinorIds((prev) => {
      const minorEdits = prev[majorId];
      if (!minorEdits) {
        return prev;
      }
      const { [minorId]: _removed, ...restMinors } = minorEdits;
      if (Object.keys(restMinors).length === 0) {
        const { [majorId]: _majorRemoved, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [majorId]: restMinors,
      };
    });
    setEditingMinorDeadlines((prev) => {
      const minorDeadlines = prev[majorId];
      if (!minorDeadlines) {
        return prev;
      }
      const { [minorId]: _removed, ...restDeadlines } = minorDeadlines;
      if (Object.keys(restDeadlines).length === 0) {
        const { [majorId]: _majorRemoved, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [majorId]: restDeadlines,
      };
    });
  };

  const handleSaveMinorTitle = (majorId: string, minorId: string) => {
    const nextTitle = editingMinorIds[majorId]?.[minorId]?.trim();
    if (!nextTitle) {
      return;
    }

    const nextDeadline = editingMinorDeadlines[majorId]?.[minorId] || undefined;

    setMajorTasks((prev) =>
      prev.map((major) =>
        major.id === majorId
          ? {
              ...major,
              minors: major.minors.map((minor) =>
                minor.id === minorId ? { ...minor, title: nextTitle, deadline: nextDeadline } : minor,
              ),
            }
          : major,
      ),
    );

    handleCancelEditMinor(majorId, minorId);
  };

  const decrementCompletionHistory = (dateKey: string | undefined) => {
    if (!dateKey) {
      return;
    }

    setCompletionHistory((prevHistory) => {
      const count = prevHistory[dateKey];
      if (!count) {
        return prevHistory;
      }

      if (count === 1) {
        const { [dateKey]: _removed, ...rest } = prevHistory;
        return rest;
      }

      return {
        ...prevHistory,
        [dateKey]: count - 1,
      };
    });
  };

  const handleDeletePastMajor = (majorId: string) => {
    setPastTasks((prev) => {
      const taskToRemove = prev.find((task) => task.id === majorId);
      if (taskToRemove?.completedAt) {
        decrementCompletionHistory(taskToRemove.completedAt);
      }
      return prev.filter((task) => task.id !== majorId);
    });
  };

  const confirmDeletePastMajor = () => {
    if (taskToDelete) {
      handleDeletePastMajor(taskToDelete);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleReopenPastMajor = (majorId: string) => {
    setPastTasks((prev) => {
      const taskToRestore = prev.find((task) => task.id === majorId);
      if (!taskToRestore) {
        return prev;
      }

      decrementCompletionHistory(taskToRestore.completedAt);

      const reopenedTask: MajorTask = {
        ...taskToRestore,
        minors: taskToRestore.minors.map((minor) => ({ ...minor, completed: false })),
        completedAt: undefined,
      };

      setMajorTasks((current) => [reopenedTask, ...current]);

      return prev.filter((task) => task.id !== majorId);
    });
  };

  const handleToggleMinor = (majorId: string, minorId: string) => {
    setMajorTasks((prev) =>
      prev.reduce<MajorTask[]>((acc, major) => {
        if (major.id !== majorId) {
          acc.push(major);
          return acc;
        }

        const wasComplete = major.minors.length > 0 && major.minors.every((minor) => minor.completed);
        const updatedMinors = major.minors.map((minor) =>
          minor.id === minorId ? { ...minor, completed: !minor.completed } : minor,
        );
        const isNowComplete = updatedMinors.length > 0 && updatedMinors.every((minor) => minor.completed);

        if (isNowComplete && !wasComplete) {
          const todayKey = new Date().toISOString().slice(0, 10);
          setCompletionHistory((prevHistory) => ({
            ...prevHistory,
            [todayKey]: (prevHistory[todayKey] ?? 0) + 1,
          }));
          const completedTask: MajorTask = {
            ...major,
            minors: updatedMinors,
            completedAt: todayKey,
          };
          setPastTasks((prevPast) => [completedTask, ...prevPast]);
          return acc;
        }

        acc.push({ ...major, minors: updatedMinors });
        return acc;
      }, []),
    );
  };

  // Removed the useEffect that was resetting time on pause

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (remainingSeconds <= 0) {
      setIsRunning(false);
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
    }
  }, [remainingSeconds, isRunning]);

  useEffect(() => {
    ambientTracks.forEach((track) => {
      if (!ambientAudioRef.current[track.value]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = 0.6;
        ambientAudioRef.current[track.value] = audio;
      }
    });

    return () => {
      Object.values(ambientAudioRef.current).forEach((audio) => {
        audio.pause();
      });
    };
  }, []);

  useEffect(() => {
    const audios = ambientAudioRef.current;

    ambientTracks.forEach((track) => {
      const audio = audios[track.value];
      if (!audio) return;

      const isActiveTrack = activeAmbientTrack === track.value;
      const shouldPlay = isActiveTrack && !isMuted && !isPaused;
      
      if (shouldPlay) {
        if (audio.paused) {
          void audio.play().catch(() => null);
        }
      } else if (isActiveTrack && (isMuted || isPaused)) {
        // Pause but keep track active (don't reset currentTime)
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        // Different track is active or no track is active
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
  }, [activeAmbientTrack, isMuted, isPaused]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      lang="en"
      className={cn(
        "relative transition-colors",
        isWallpaperActive ? "text-white" : "text-slate-900",
      )}
      style={{
        ...backgroundStyle,
        height: isFullscreen ? '100vh' : 'calc(100vh - 4rem)',
        overflow: 'hidden',
      }}
    >
      <div className="container py-8 h-full flex flex-col overflow-hidden">
        {!isFullscreen && (
          <div className="mb-12 flex-shrink-0">
            <PageTitle
              as="h1"
              variant={isWallpaperActive ? "inverted" : "default"}
              className="text-5xl md:text-6xl"
            >
              Deep Focus
            </PageTitle>
          </div>
        )}

        <main className="flex-1 flex items-end justify-center overflow-hidden pb-20">
          <div className="flex w-full flex-col gap-8 text-center">
        <div className="space-y-6">
          <div
            className={cn(
              "text-[6rem] font-semibold leading-none tracking-tight",
              isWallpaperActive
                ? "drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                : "text-slate-900",
            )}
          >
            {displayTime}
          </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  if (!isRunning && remainingSeconds === 0) {
                    setRemainingSeconds(selectedDuration * 60);
                  }
                  setIsRunning((prev) => !prev);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-full px-10 text-lg font-semibold transition",
                  isWallpaperActive
                    ? "border border-white/40 bg-white/20 text-white backdrop-blur hover:bg-white/30"
                    : "border border-primary/40 bg-primary text-primary-foreground hover:bg-primary-hover",
                )}
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isRunning ? "Pause" : "Start"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsRunning(false);
                  setRemainingSeconds(selectedDuration * 60);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-full px-10 text-lg font-semibold transition",
                  isWallpaperActive
                    ? "border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    : "border border-primary/40 text-primary hover:bg-primary/10",
                )}
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              {presetDurations.map((minutes) => {
                const isSelected = selectedDuration === minutes && !isCustomSelected;

                return (
                  <Button
                    key={minutes}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(minutes)}
                    className={cn(
                      "rounded-full px-5 text-sm font-medium transition-colors duration-200",
                      isSelected
                        ? isWallpaperActive
                          ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                          : "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        : isWallpaperActive
                          ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                          : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                    )}
                  >
                    {minutes} min
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomTimer(!showCustomTimer);
                  // Only reset time if switching from preset to custom (not already in custom mode)
                  if (!showCustomTimer && !isCustomSelected) {
                    setIsCustomSelected(true);
                    setIsRunning(false);
                    setCustomHours(0);
                    setCustomMinutes(0);
                    setCustomSeconds(3);
                    setRemainingSeconds(3);
                    setSelectedDuration(0.05);
                    setDirectTimeInput("00:00:03");
                  } else if (!showCustomTimer && isCustomSelected) {
                    // Just opening the panel again, don't reset anything
                    setIsCustomSelected(true);
                  }
                }}
                className={cn(
                  "rounded-full px-5 text-sm font-medium transition-colors duration-200",
                  isCustomSelected
                    ? isWallpaperActive
                      ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                      : "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                Custom
              </Button>
            </div>
            
            {/* Fixed height container for custom timer to prevent layout shift */}
            <div className={cn("transition-all duration-300", showCustomTimer ? "h-[60px]" : "h-0")}>
              {showCustomTimer && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("text-xs font-medium", isWallpaperActive ? "text-white/70" : "text-slate-600")}>
                      Hours
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-20 rounded-full px-3 text-sm font-medium transition-colors duration-200",
                            isWallpaperActive
                              ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                              : "border-primary text-primary hover:bg-primary/10",
                          )}
                        >
                          {String(customHours).padStart(2, "0")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="h-48 overflow-y-auto">
                        {Array.from({ length: 24 }, (_, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => {
                              setCustomHours(i);
                              updateCustomTime(i, customMinutes, customSeconds);
                            }}
                            className="cursor-pointer"
                          >
                            {String(i).padStart(2, "0")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <span className={cn("text-2xl font-bold mt-5", isWallpaperActive ? "text-white" : "text-slate-900")}>
                    :
                  </span>

                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("text-xs font-medium", isWallpaperActive ? "text-white/70" : "text-slate-600")}>
                      Minutes
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-20 rounded-full px-3 text-sm font-medium transition-colors duration-200",
                            isWallpaperActive
                              ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                              : "border-primary text-primary hover:bg-primary/10",
                          )}
                        >
                          {String(customMinutes).padStart(2, "0")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="h-48 overflow-y-auto">
                        {Array.from({ length: 60 }, (_, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => {
                              setCustomMinutes(i);
                              updateCustomTime(customHours, i, customSeconds);
                            }}
                            className="cursor-pointer"
                          >
                            {String(i).padStart(2, "0")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <span className={cn("text-2xl font-bold mt-5", isWallpaperActive ? "text-white" : "text-slate-900")}>
                    :
                  </span>

                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("text-xs font-medium", isWallpaperActive ? "text-white/70" : "text-slate-600")}>
                      Seconds
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-20 rounded-full px-3 text-sm font-medium transition-colors duration-200",
                            isWallpaperActive
                              ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                              : "border-primary text-primary hover:bg-primary/10",
                          )}
                        >
                          {String(customSeconds).padStart(2, "0")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="h-48 overflow-y-auto">
                        {Array.from({ length: 60 }, (_, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => {
                              setCustomSeconds(i);
                              updateCustomTime(customHours, customMinutes, i);
                            }}
                            className="cursor-pointer"
                          >
                            {String(i).padStart(2, "0")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
          </div>

          <blockquote
            className={cn(
              "mx-auto mt-8 max-w-2xl text-lg font-medium text-center",
              isWallpaperActive ? "text-white/85" : "text-slate-600",
            )}
          >
            “Concentration is the secret of strength.”
          </blockquote>
          </div>
        </main>

        <aside className="absolute top-4 right-4 bottom-4 flex w-[clamp(22rem,34vw,36rem)] flex-col items-stretch gap-4 sm:top-8 sm:right-8 sm:bottom-8">
          <div className="flex flex-wrap items-center justify-end gap-20">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setIsAmbientPanelOpen((prev) => !prev);
                  if (!isAmbientPanelOpen) {
                    setIsTrackerCollapsed(true);
                  }
                  setIsWallpaperPanelOpen(false);
                }}
                className={cn(
                  "h-12 w-12 rounded-full border transition-colors duration-200",
                  isAmbientPanelOpen
                    ? isWallpaperActive
                      ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                      : "border-primary bg-primary text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 fill-red-700 text-red-700" />
                ) : activeAmbientTrack && !isPaused ? (
                  <Volume2 className="h-5 w-5 fill-current" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setIsWallpaperPanelOpen((prev) => !prev);
                  if (!isWallpaperPanelOpen) {
                    setIsTrackerCollapsed(true);
                  }
                  setIsAmbientPanelOpen(false);
                }}
                className={cn(
                  "h-12 w-12 rounded-full border transition-colors duration-200",
                  isWallpaperPanelOpen
                    ? isWallpaperActive
                      ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                      : "border-primary bg-primary text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "h-12 rounded-full px-5 text-sm font-semibold border transition-colors duration-200",
                  isTrackerCollapsed
                    ? isWallpaperActive
                      ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                      : "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
                onClick={() => {
                  setIsTrackerCollapsed((prev) => !prev);
                  setIsAmbientPanelOpen(false);
                  setIsWallpaperPanelOpen(false);
                }}
              >
                Micro Goal Study Tracker
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              className={cn(
                "h-12 w-12 rounded-full border transition-colors duration-200",
                isFullscreen
                  ? isWallpaperActive
                    ? "border-white bg-white text-slate-900 hover:bg-white hover:text-slate-900"
                    : "border-primary bg-primary text-primary-foreground"
                  : isWallpaperActive
                    ? "border-white/70 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>

          {isAmbientPanelOpen && (
            <div
              className={cn(
                "rounded-2xl p-4",
                isWallpaperActive
                  ? "bg-black/35 text-white backdrop-blur"
                  : "border border-slate-300 bg-white text-slate-700 shadow-sm",
              )}
            >
              <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span>Ambient Sounds</span>
                  {isMuted ? (
                    <VolumeX className={cn("h-5 w-5 fill-red-700 text-red-700")} />
                  ) : activeAmbientTrack && !isPaused ? (
                    <Volume2 className={cn("h-5 w-5 fill-primary text-primary")} />
                  ) : (
                    <Volume2 className={cn("h-5 w-5", isWallpaperActive ? "text-white/70" : "text-slate-500")} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMuted((prev) => !prev);
                    }}
                    className={cn(
                      "flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                      "active:scale-[0.98]",
                      "focus-visible:outline-none focus-visible:ring-2",
                      isWallpaperActive
                        ? "focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                        : "focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      isWallpaperActive
                        ? "border-white/35 bg-white/18 text-white/80 hover:bg-white/28 hover:shadow-[0_12px_30px_-20px_rgba(255,255,255,0.65)]"
                        : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:shadow-sm",
                    )}
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  {activeAmbientTrack && (
                    <button
                      type="button"
                      onClick={() => setIsPaused((prev) => !prev)}
                      className={cn(
                        "flex items-center justify-center rounded-xl border px-4 py-2 text-sm transition-all duration-200",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2",
                        isWallpaperActive
                          ? "focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                          : "focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        isWallpaperActive
                          ? "border-white/35 bg-white/18 text-white/80 hover:bg-white/28 hover:shadow-[0_12px_30px_-20px_rgba(255,255,255,0.65)]"
                          : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:shadow-sm",
                      )}
                    >
                      {isPaused ? (
                        <Play className="h-5 w-5 text-green-600" />
                      ) : (
                        <Pause className="h-5 w-5 text-red-700" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {ambientTracks.map((track) => {
                  const Icon = track.icon;
                  const isActive = activeAmbientTrack === track.value;
                  return (
                    <button
                      key={track.value}
                      type="button"
                      onClick={() => toggleAmbientTrack(track.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2",
                        isWallpaperActive
                          ? "focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                          : "focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        isActive
                          ? isWallpaperActive
                            ? "border-white bg-white text-slate-900 shadow-lg"
                            : "border-primary bg-primary text-white shadow-lg"
                          : isWallpaperActive
                            ? "border-white/35 bg-white/18 text-white/80 hover:bg-white/28 hover:shadow-[0_12px_30px_-20px_rgba(255,255,255,0.65)]"
                            : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:shadow-sm",
                      )}
                      aria-pressed={isActive}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {track.label}
                      </span>
                      <span className={cn(
                        "text-xs",
                        isActive && (isMuted || isPaused) && "text-red-700 font-bold"
                      )}>
                        {isActive 
                          ? (isPaused && isMuted ? "Paused (Muted)" 
                            : isPaused ? "Paused" 
                            : isMuted ? "Playing (Muted)" 
                            : "Playing") 
                          : "Add"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isWallpaperPanelOpen && (
            <div
              className={cn(
                "rounded-2xl p-4",
                isWallpaperActive
                  ? "bg-black/35 text-white backdrop-blur"
                  : "border border-slate-200 bg-white text-slate-700 shadow-sm",
              )}
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4" />
                <span>Wallpaper</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {wallpapers.map((option) => (
                  <Card
                    key={option.value}
                    onClick={() => setSelectedWallpaper(option.value)}
                    className={cn(
                      "cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]",
                      "active:scale-[0.98]",
                      selectedWallpaper === option.value
                        ? isWallpaperActive
                          ? "ring-2 ring-white shadow-lg"
                          : "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md",
                      isWallpaperActive
                        ? "bg-white/10 border-white/30"
                        : "bg-white border-slate-200"
                    )}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {option.url ? (
                        <img
                          src={option.url}
                          alt={option.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          isWallpaperActive ? "bg-white/20" : "bg-slate-100"
                        )}>
                          <ImageIcon className={cn(
                            "h-8 w-8",
                            isWallpaperActive ? "text-white/50" : "text-slate-400"
                          )} />
                        </div>
                      )}
                      {selectedWallpaper === option.value && (
                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "p-2 text-center text-sm font-medium",
                      isWallpaperActive ? "text-white" : "text-slate-700"
                    )}>
                      {option.label}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!isTrackerCollapsed && (
            <div
              ref={trackerRef}
              className={cn(
                "flex flex-1 flex-col rounded-3xl border border-slate-300 bg-white text-slate-700 shadow-lg overflow-hidden min-h-[38rem] md:min-h-[42rem]",
                isWallpaperActive ? "border-white/35 bg-black/35 text-white backdrop-blur" : ""
              )}
            >
              {/* Section 1: Header + Create */}
              <div className={cn("px-5 py-4 sm:px-6 sm:py-5 border-b", isWallpaperActive ? "border-white/20" : "border-slate-300")}> 
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-2xl font-bold tracking-tight">Micro Goal Study Tracker</p>
                  </div>
                  <div
                    className={cn(
                      "w-full max-w-[12rem] flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs shadow-sm transition-colors sm:w-auto",
                      isWallpaperActive
                        ? "border-white/35 bg-white/16 text-white backdrop-blur"
                        : "border-slate-200 bg-slate-50 text-slate-700",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          isWallpaperActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
                        )}
                      >
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <div className="leading-tight">
                        <p
                          className={cn(
                            "text-[0.6rem] font-semibold uppercase tracking-wide",
                            isWallpaperActive ? "text-white/70" : "text-slate-500",
                          )}
                        >
                          Today
                        </p>
                        <p className="text-sm font-semibold">Task Completed: {todaysCompletionCount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2.5">
                    <Input
                      value={newMajorTitle}
                      onChange={(event) => setNewMajorTitle(event.target.value)}
                      placeholder="Create a major task"
                      className={cn(
                        "flex-1 h-11 text-base",
                        isWallpaperActive
                          ? "border-white/30 bg-white/10 text-white placeholder:text-white/55 focus-visible:border-white/65 focus-visible:ring-white/55 focus-visible:ring-offset-0"
                          : "",
                      )}
                    />
                    <Button
                      type="button"
                      size="lg"
                      className={cn(
                        "shrink-0 h-11 px-6 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                        isWallpaperActive
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                      onClick={handleAddMajor}
                      disabled={!newMajorTitle.trim()}
                    >
                      Create
                    </Button>
                  </div>
                  <DatePicker
                    value={newMajorDeadline}
                    onChange={setNewMajorDeadline}
                    placeholder="Set deadline (optional)"
                    className="h-9 text-sm w-full"
                    isWallpaperActive={isWallpaperActive}
                  />
                </div>
              </div>

              {/* Section 2: Tasks (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0">
                <div className="space-y-5">
                  {majorTasks.map((major) => {
                    const totalMinors = major.minors.length;
                    const completedMinors = major.minors.filter((minor) => minor.completed).length;
                    const progress = totalMinors === 0 ? 0 : Math.round((completedMinors / totalMinors) * 100);

                    return (
                      <div
                        key={major.id}
                        className={cn(
                          "rounded-2xl border p-4",
                          isWallpaperActive
                            ? "border-white/45 bg-white/22"
                            : "border-slate-300 bg-slate-50",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-1 min-w-[44px] text-sm font-semibold",
                              isWallpaperActive ? "text-white/70" : "text-slate-500",
                            )}
                          >
                            {progress}%
                          </span>
                          <div className="flex-1">
                            {editingMajorIds[major.id] !== undefined ? (
                              <div className="space-y-2">
                                <Input
                                  value={editingMajorIds[major.id] ?? ""}
                                  onChange={(event) => handleEditMajorChange(major.id, event.target.value)}
                                  className={cn(
                                    "h-9 text-base",
                                    isWallpaperActive
                                      ? "border-white/55 bg-white/26 text-white placeholder:text-white/70 focus-visible:border-white/80 focus-visible:ring-white/60 focus-visible:ring-offset-0"
                                      : "",
                                  )}
                                  autoFocus
                                />
                                <DatePicker
                                  value={editingMajorDeadlines[major.id] ?? ""}
                                  onChange={(date) => setEditingMajorDeadlines((prev) => ({ ...prev, [major.id]: date }))}
                                  placeholder="Set deadline"
                                  className="h-8 text-sm w-full"
                                  isWallpaperActive={isWallpaperActive}
                                />
                              </div>
                            ) : (
                              <div>
                                <p className="text-lg font-semibold leading-snug">{major.title}</p>
                                {major.deadline && (
                                  <p className={cn("text-xs mt-1", isWallpaperActive ? "text-white/70" : "text-slate-500")}>
                                    📅 Due: {new Date(major.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {editingMajorIds[major.id] !== undefined ? (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveMajorTitle(major.id)}
                                  className={cn(
                                    "h-8 w-8 bg-emerald-600 text-white transition-colors hover:bg-emerald-700",
                                    isWallpaperActive ? "shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" : "",
                                  )}
                                  disabled={!editingMajorIds[major.id]?.trim()}
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Save major task title</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCancelEditMajor(major.id)}
                                  className={cn(
                                    "h-8 w-8 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
                                    isWallpaperActive ? "bg-white/10" : "",
                                  )}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel editing major task</span>
                                </Button>
                              </>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "h-8 w-8 text-muted-foreground hover:text-primary",
                                      isWallpaperActive ? "hover:bg-white/20" : "",
                                    )}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open major task actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className={cn(
                                    "w-32 rounded-xl border p-2 space-y-2",
                                    isWallpaperActive
                                      ? "border-white/30 bg-white/10 text-white backdrop-blur"
                                      : "border-slate-200 bg-white text-slate-700 shadow-lg",
                                  )}
                                >
                                  <DropdownMenuItem
                                    className="w-full cursor-pointer rounded-lg bg-emerald-600 text-center text-white hover:bg-emerald-600 focus:bg-emerald-700"
                                    onSelect={() => handleStartEditMajor(major.id, major.title, major.deadline)}
                                  >
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="w-full cursor-pointer rounded-lg border border-red-500 text-center text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                                    onSelect={() => handleDeleteMajor(major.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 space-y-1.5">
                          <div className={cn("h-2 overflow-hidden rounded-full", isWallpaperActive ? "bg-white/10" : "bg-slate-200")}
                          >
                            <div
                              className={cn("h-full rounded-full transition-all", isWallpaperActive ? "bg-white" : "bg-primary")}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {major.minors.length > 0 && (
                            <div className="space-y-1.5">
                              {major.minors.map((minor) => {
                                const editingMinorValue = editingMinorIds[major.id]?.[minor.id];
                                const isEditingMinor = editingMinorValue !== undefined;

                                return (
                                  <div key={minor.id} className="flex items-start gap-2 text-sm">
                                    <label className="flex flex-1 items-start gap-2">
                                      <Checkbox
                                        checked={minor.completed}
                                        onCheckedChange={() => handleToggleMinor(major.id, minor.id)}
                                        className={cn(
                                          "mt-0.5",
                                          isWallpaperActive
                                            ? "border-white/50 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-slate-900"
                                            : "",
                                        )}
                                        disabled={isEditingMinor}
                                      />
                                      {isEditingMinor ? (
                                        <div className="flex-1 space-y-1.5">
                                          <Input
                                            value={editingMinorValue ?? ""}
                                            onChange={(event) => handleEditMinorChange(major.id, minor.id, event.target.value)}
                                            className={cn(
                                              "h-8 text-sm",
                                              isWallpaperActive
                                                ? "border-white/45 bg-white/18 text-white placeholder:text-white/55 focus-visible:border-white/70 focus-visible:ring-white/60 focus-visible:ring-offset-0"
                                                : "",
                                            )}
                                            autoFocus
                                          />
                                          <DatePicker
                                            value={editingMinorDeadlines[major.id]?.[minor.id] ?? ""}
                                            onChange={(date) =>
                                              setEditingMinorDeadlines((prev) => ({
                                                ...prev,
                                                [major.id]: {
                                                  ...(prev[major.id] ?? {}),
                                                  [minor.id]: date,
                                                },
                                              }))
                                            }
                                            placeholder="Set deadline"
                                            className="h-7 text-xs w-full"
                                            isWallpaperActive={isWallpaperActive}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex-1">
                                          <span
                                            className={cn(
                                              "leading-relaxed block",
                                              minor.completed
                                                ? isWallpaperActive
                                                  ? "text-white/60 line-through"
                                                  : "text-slate-500 line-through"
                                                : isWallpaperActive
                                                  ? "text-white"
                                                  : "text-slate-700",
                                            )}
                                          >
                                            {minor.title}
                                          </span>
                                          {minor.deadline && (
                                            <span className={cn("text-xs mt-0.5 block", isWallpaperActive ? "text-white/60" : "text-slate-400")}>
                                              📅 {new Date(minor.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </label>
                                    <div className="flex items-center gap-1">
                                      {isEditingMinor ? (
                                        <>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleSaveMinorTitle(major.id, minor.id)}
                                            className={cn(
                                              "h-7 w-7 bg-emerald-600 text-white transition-colors hover:bg-emerald-700",
                                              isWallpaperActive ? "shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" : "",
                                            )}
                                            disabled={!editingMinorValue?.trim()}
                                          >
                                            <Check className="h-4 w-4" />
                                            <span className="sr-only">Save mini task title</span>
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCancelEditMinor(major.id, minor.id)}
                                            className={cn(
                                              "h-7 w-7 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
                                              isWallpaperActive ? "bg-white/10" : "",
                                            )}
                                          >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Cancel editing mini task</span>
                                          </Button>
                                        </>
                                      ) : (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              className={cn(
                                                "h-7 w-7 text-muted-foreground hover:text-primary",
                                                isWallpaperActive ? "hover:bg-white/20" : "",
                                              )}
                                            >
                                              <MoreVertical className="h-4 w-4" />
                                              <span className="sr-only">Open mini task actions</span>
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                            align="end"
                                            className={cn(
                                              "w-32 rounded-xl border p-2 space-y-2",
                                              isWallpaperActive
                                                ? "border-white/30 bg-white/10 text-white backdrop-blur"
                                                : "border-slate-200 bg-white text-slate-700 shadow-lg",
                                            )}
                                          >
                                            <DropdownMenuItem
                                              className="w-full cursor-pointer rounded-lg bg-emerald-600 text-center text-white hover:bg-emerald-600 focus:bg-emerald-700"
                                              onSelect={() => handleStartEditMinor(major.id, minor.id, minor.title, minor.deadline)}
                                            >
                                              Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              className="w-full cursor-pointer rounded-lg border border-red-500 text-center text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                                              onSelect={() => handleDeleteMinor(major.id, minor.id)}
                                            >
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="mt-5 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={newMinorInputs[major.id] ?? ""}
                              onChange={(event) =>
                                setNewMinorInputs((prev) => ({ ...prev, [major.id]: event.target.value }))
                              }
                              placeholder="Add a mini task"
                              className={cn(
                                "flex-1 h-11 text-base",
                                isWallpaperActive
                                  ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/65 focus-visible:ring-white/55 focus-visible:ring-offset-0"
                                  : "",
                              )}
                            />
                            <Button
                              type="button"
                              size="lg"
                              className={cn(
                                "shrink-0 px-5 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                                isWallpaperActive
                                  ? "bg-white/20 text-white hover:bg-white/30"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                              )}
                              onClick={() => handleAddMinor(major.id)}
                              disabled={!(newMinorInputs[major.id] ?? "").trim()}
                            >
                              Add
                            </Button>
                          </div>
                          <DatePicker
                            value={newMinorDeadlines[major.id] ?? ""}
                            onChange={(date) =>
                              setNewMinorDeadlines((prev) => ({ ...prev, [major.id]: date }))
                            }
                            placeholder="Set deadline (optional)"
                            className="h-9 text-sm w-full"
                            isWallpaperActive={isWallpaperActive}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pastTasks.length > 0 && (
                  <div className="space-y-5 border-t pt-6">
                    <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wider">
                      <span>Past Major Tasks</span>
                      <span className={cn(isWallpaperActive ? "text-white/65" : "text-slate-400")}>Completed</span>
                    </div>
                    <div className="space-y-4">
                      {pastTasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "rounded-2xl border px-5 py-4 text-base",
                            isWallpaperActive ? "border-white/15 bg-white/5" : "border-slate-300 bg-slate-50",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-lg font-semibold">{task.title}</p>
                                <span className={cn("text-sm", isWallpaperActive ? "text-emerald-900" : "text-emerald-800")}>Done</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReopenPastMajor(task.id)}
                                className={cn(
                                  "h-8 w-8 text-muted-foreground hover:text-primary",
                                  isWallpaperActive ? "hover:bg-white/20" : "",
                                )}
                              >
                                <Undo2 className="h-4 w-4" />
                                <span className="sr-only">Reopen task</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setTaskToDelete(task.id);
                                  setDeleteConfirmOpen(true);
                                }}
                                className={cn(
                                  "h-8 w-8 text-muted-foreground hover:text-destructive",
                                  isWallpaperActive ? "hover:bg-white/20" : "",
                                )}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove past task</span>
                              </Button>
                            </div>
                          </div>
                          <p className={cn("text-xs uppercase tracking-wide", isWallpaperActive ? "text-white/55" : "text-slate-400")}>Finished {task.completedAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Last 7 Days (Fixed at Bottom) */}
              <div className={cn("border-t px-4 py-2 sm:px-5 sm:py-2.5", isWallpaperActive ? "border-white/35 bg-white/12" : "border-slate-300 bg-slate-50/50")}> 
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                    <span>Last 7 Days</span>
                    <span className={cn(isWallpaperActive ? "text-white/60" : "text-slate-400")}>Major tasks</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {last7Days.map((day) => {
                      const hasCompletion = Boolean(completionHistory[day.dateKey]);
                      const isToday = day.dateKey === todayKey;
                      return (
                        <div key={day.dateKey} className="flex flex-col items-center gap-0.5 text-center">
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wide",
                              isToday
                                ? isWallpaperActive
                                  ? "text-emerald-600"
                                  : "text-emerald-700"
                                : "invisible",
                            )}
                            aria-hidden={!isToday}
                          >
                            Today
                          </span>
                          <div
                            className={cn(
                              "flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full border text-[0.8125rem] font-semibold transition",
                              hasCompletion
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : isToday
                                  ? isWallpaperActive
                                    ? "border-white/60 bg-white/10 text-white"
                                    : "border-primary bg-primary/5 text-primary"
                                  : isWallpaperActive
                                    ? "border-white/20 text-white/70"
                                    : "border-slate-300 text-slate-500",
                              isToday
                                ? isWallpaperActive
                                  ? "ring-2 ring-white/60"
                                  : "ring-2 ring-primary/50"
                                : null,
                            )}
                          >
                            {day.dayNumber}
                          </div>
                          <span
                            className={cn(
                              "text-[11px] uppercase tracking-wide",
                              isToday
                                ? isWallpaperActive
                                  ? "text-white"
                                  : "text-primary"
                                : isWallpaperActive
                                  ? "text-white/50"
                                  : "text-slate-400",
                            )}
                          >
                            {day.weekday.slice(0, 2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Completed Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this completed task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePastMajor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FocusLearning;
