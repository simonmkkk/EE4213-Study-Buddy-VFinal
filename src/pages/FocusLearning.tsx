import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Pencil,
  Check,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MinorTask {
  id: string;
  title: string;
  completed: boolean;
}

interface MajorTask {
  id: string;
  title: string;
  minors: MinorTask[];
  completedAt?: string;
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAmbientPanelOpen, setIsAmbientPanelOpen] = useState<boolean>(false);
  const [isWallpaperPanelOpen, setIsWallpaperPanelOpen] = useState<boolean>(false);
  const [activeAmbientTracks, setActiveAmbientTracks] = useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(presetDurations[0] * 60);
  const [majorTasks, setMajorTasks] = useState<MajorTask[]>(defaultMajorTasks);
  const [newMajorTitle, setNewMajorTitle] = useState<string>("");
  const [newMinorInputs, setNewMinorInputs] = useState<Record<string, string>>({});
  const [completionHistory, setCompletionHistory] = useState<Record<string, number>>(defaultCompletionHistory);
  const [pastTasks, setPastTasks] = useState<MajorTask[]>([]);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(false);
  const [editingMajorIds, setEditingMajorIds] = useState<Record<string, string>>({});
  const [editingMinorIds, setEditingMinorIds] = useState<Record<string, Record<string, string>>>({});

  const ambientAudioRef = useRef<Record<string, HTMLAudioElement>>({});

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

  const handlePresetSelect = (minutes: number) => {
    setSelectedDuration(minutes);
    setIsRunning(false);
    setRemainingSeconds(minutes * 60);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    } else {
      document.documentElement.requestFullscreen().catch(() => null);
    }
  };

  const toggleAmbientTrack = (trackValue: string) => {
    setActiveAmbientTracks((prev) => {
      const isActive = prev.includes(trackValue);
      const nextTracks = isActive
        ? prev.filter((value) => value !== trackValue)
        : [...prev, trackValue];

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

      if (audio) {
        if (isActive) {
          audio.pause();
          audio.currentTime = 0;
        } else if (!isMuted) {
          void audio.play().catch(() => null);
        }
      }

      return nextTracks;
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
    };

    setMajorTasks((prev) => [newTask, ...prev]);
    setNewMajorTitle("");
  };

  const handleAddMinor = (majorId: string) => {
    const value = (newMinorInputs[majorId] ?? "").trim();
    if (!value) {
      return;
    }

    setMajorTasks((prev) =>
      prev.map((major) =>
        major.id === majorId
          ? {
              ...major,
              minors: [...major.minors, { id: createId(), title: value, completed: false }],
            }
          : major,
      ),
    );

    setNewMinorInputs((prev) => ({ ...prev, [majorId]: "" }));
  };

  const handleStartEditMajor = (majorId: string, currentTitle: string) => {
    setEditingMajorIds((prev) => ({ ...prev, [majorId]: currentTitle }));
  };

  const handleEditMajorChange = (majorId: string, value: string) => {
    setEditingMajorIds((prev) => ({ ...prev, [majorId]: value }));
  };

  const handleCancelEditMajor = (majorId: string) => {
    setEditingMajorIds((prev) => {
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

    setMajorTasks((prev) =>
      prev.map((major) => (major.id === majorId ? { ...major, title: nextTitle } : major)),
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

  const handleStartEditMinor = (majorId: string, minorId: string, currentTitle: string) => {
    setEditingMinorIds((prev) => ({
      ...prev,
      [majorId]: {
        ...(prev[majorId] ?? {}),
        [minorId]: currentTitle,
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
  };

  const handleSaveMinorTitle = (majorId: string, minorId: string) => {
    const nextTitle = editingMinorIds[majorId]?.[minorId]?.trim();
    if (!nextTitle) {
      return;
    }

    setMajorTasks((prev) =>
      prev.map((major) =>
        major.id === majorId
          ? {
              ...major,
              minors: major.minors.map((minor) =>
                minor.id === minorId ? { ...minor, title: nextTitle } : minor,
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
    setPastTasks((prev) => prev.filter((task) => task.id !== majorId));
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

  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning]);

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

      const shouldPlay = activeAmbientTracks.includes(track.value) && !isMuted;
      if (shouldPlay) {
        if (audio.paused) {
          void audio.play().catch(() => null);
        }
      } else {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
  }, [activeAmbientTracks, isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      className={cn(
        "relative h-[calc(100vh-4rem)] overflow-hidden transition-colors",
        isWallpaperActive ? "text-white" : "text-slate-900",
      )}
      style={backgroundStyle}
    >
      <div className={cn("absolute inset-0", isWallpaperActive ? "bg-transparent" : "bg-white")} />
      <div className="relative z-10 flex h-full flex-col items-center px-4 sm:px-6">
        <header className="flex w-full max-w-6xl items-start justify-between py-6 sm:py-8 shrink-0">
          <div className="space-y-1">
            <p
              className={cn(
                "text-xs uppercase tracking-[0.4em]",
                isWallpaperActive ? "text-white/60" : "text-slate-500",
              )}
            >
              Focus Learning
            </p>
            <h1
              className={cn(
                "text-4xl font-semibold",
                isWallpaperActive ? "text-white" : "text-slate-900",
              )}
            >
              Deep Focus Session
            </h1>
            <p className={cn("text-sm", isWallpaperActive ? "text-white/70" : "text-slate-600")}
            >
              Set the mood, stay distraction-free, and start your next study sprint.
            </p>
          </div>
        </header>

        <main className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 text-center min-h-0 py-6 sm:py-8">
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
                    ? "bg-white/20 text-white backdrop-blur hover:bg-white/30"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover",
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
            <p
              className={cn(
                "text-xs uppercase tracking-[0.35em]",
                isWallpaperActive ? "text-white/60" : "text-slate-500",
              )}
            >
              Quick Presets
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {presetDurations.map((minutes) => {
                const isSelected = selectedDuration === minutes;

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
            </div>
          </div>

          <blockquote
            className={cn(
              "max-w-2xl text-lg font-medium",
              isWallpaperActive ? "text-white/85" : "text-slate-600",
            )}
          >
            “Concentration is the secret of strength.”
          </blockquote>
        </main>

        <aside className="absolute top-4 right-4 bottom-4 flex w-[clamp(22rem,34vw,36rem)] flex-col items-stretch gap-4 sm:top-8 sm:right-8 sm:bottom-8">
          <div className="flex flex-wrap items-center justify-end gap-10">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "h-12 rounded-full px-5 text-sm font-semibold border transition-colors duration-200",
                  isTrackerCollapsed
                    ? isWallpaperActive
                      ? "border-white text-white hover:bg-white hover:text-slate-900"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white bg-white text-slate-900"
                      : "border-primary bg-primary text-primary-foreground",
                )}
                onClick={() => {
                  setIsTrackerCollapsed((prev) => !prev);
                  setIsAmbientPanelOpen(false);
                  setIsWallpaperPanelOpen(false);
                }}
              >
                Micro Goal Study Tracker
              </Button>
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
                      ? "border-white bg-white text-slate-900"
                      : "border-primary bg-primary text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white text-white hover:bg-white hover:text-slate-900"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {isMuted || activeAmbientTracks.length === 0 ? (
                  <VolumeX className="h-5 w-5" />
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
                      ? "border-white bg-white text-slate-900"
                      : "border-primary bg-primary text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white text-white hover:bg-white hover:text-slate-900"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullscreen}
                className={cn(
                  "h-12 w-12 rounded-full border transition-colors duration-200",
                  isFullscreen
                    ? isWallpaperActive
                      ? "border-white bg-white text-slate-900"
                      : "border-primary bg-primary text-primary-foreground"
                    : isWallpaperActive
                      ? "border-white text-white hover:bg-white hover:text-slate-900"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
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
                <span>Ambient Sounds</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs",
                    isWallpaperActive
                      ? "text-white/80 hover:bg-white/20"
                      : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
              <div className="space-y-2">
                {ambientTracks.map((track) => {
                  const Icon = track.icon;
                  const isActive = activeAmbientTracks.includes(track.value);
                  return (
                    <button
                      key={track.value}
                      type="button"
                      onClick={() => toggleAmbientTrack(track.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                        isActive
                          ? isWallpaperActive
                            ? "border-white/75 bg-white/35 text-white"
                            : "border-primary/60 bg-primary/10 text-primary"
                          : isWallpaperActive
                            ? "border-white/35 bg-white/18 text-white/80 hover:bg-white/28"
                            : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {track.label}
                      </span>
                      <span className="text-xs">
                        {isActive ? (isMuted ? "Paused" : "Playing") : "Add"}
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
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4" />
                <span>Wallpaper</span>
              </div>
              <div className="space-y-2">
                {wallpapers.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedWallpaper(option.value)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                      selectedWallpaper === option.value
                        ? isWallpaperActive
                          ? "border-white/75 bg-white/35 text-white"
                          : "border-primary/60 bg-primary/10 text-primary"
                        : isWallpaperActive
                          ? "border-white/35 bg-white/18 text-white/80 hover:bg-white/28"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isTrackerCollapsed && (
            <div
              className={cn(
                "flex flex-1 flex-col rounded-3xl border border-slate-300 bg-white text-slate-700 shadow-lg overflow-hidden min-h-[38rem] md:min-h-[42rem]",
                isWallpaperActive ? "border-white/30 bg-black/65 text-white backdrop-blur" : ""
              )}
            >
              {/* Section 1: Header + Create */}
              <div className={cn("px-5 py-4 sm:px-6 sm:py-5 border-b", isWallpaperActive ? "border-white/20" : "border-slate-300")}> 
                <div className="mb-1">
                  <p className="text-2xl font-bold tracking-tight">Micro Goal Study Tracker</p>
                </div>

                <div className={cn("mb-2 rounded-lg px-3 py-1 text-sm font-medium", isWallpaperActive ? "bg-white/15 text-white/90" : "bg-slate-100 text-slate-600")}> 
                  Today: {completionHistory[new Date().toISOString().slice(0, 10)] ?? 0} major task(s) completed
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Input
                  value={newMajorTitle}
                  onChange={(event) => setNewMajorTitle(event.target.value)}
                  placeholder="Create a major task"
                  className={cn(
                    "flex-1 h-11 text-base",
                    isWallpaperActive
                      ? "border-white/50 bg-white/20 text-white placeholder:text-white/65"
                      : "",
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "shrink-0 px-6 text-sm font-semibold border transition-colors duration-200",
                    isTrackerCollapsed
                      ? isWallpaperActive
                        ? "border-white text-white hover:bg-white hover:text-slate-900"
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      : isWallpaperActive
                        ? "border-white bg-white text-slate-900"
                        : "border-primary bg-primary text-primary-foreground",
                  )}
                  onClick={handleAddMajor}
                  disabled={!newMajorTitle.trim()}
                >
                  Create
                </Button>
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
                            ? "border-white/40 bg-white/15"
                            : "border-slate-300 bg-slate-50",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              {editingMajorIds[major.id] !== undefined ? (
                                <Input
                                  value={editingMajorIds[major.id] ?? ""}
                                  onChange={(event) => handleEditMajorChange(major.id, event.target.value)}
                                  className={cn(
                                    "h-9 text-base",
                                    isWallpaperActive
                                      ? "border-white/50 bg-white/20 text-white placeholder:text-white/70"
                                      : "",
                                  )}
                                  autoFocus
                                />
                              ) : (
                                <p className="text-lg font-semibold leading-snug">{major.title}</p>
                              )}
                              <span className={cn("text-sm", isWallpaperActive ? "text-white/70" : "text-slate-500")}>{completedMinors}/{totalMinors || 0}</span>
                            </div>
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
                                    "h-8 w-8 text-emerald-600 hover:text-emerald-700",
                                    isWallpaperActive ? "hover:bg-white/20" : "",
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
                                    "h-8 w-8 text-muted-foreground hover:text-destructive",
                                    isWallpaperActive ? "hover:bg-white/20" : "",
                                  )}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel editing major task</span>
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartEditMajor(major.id, major.title)}
                                className={cn(
                                  "h-8 w-8 text-muted-foreground hover:text-primary",
                                  isWallpaperActive ? "hover:bg-white/20" : "",
                                )}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit major task title</span>
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMajor(major.id)}
                              className={cn(
                                "h-8 w-8 text-muted-foreground hover:text-destructive",
                                isWallpaperActive ? "hover:bg-white/20" : "",
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete major task</span>
                            </Button>
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
                                        <Input
                                          value={editingMinorValue ?? ""}
                                          onChange={(event) => handleEditMinorChange(major.id, minor.id, event.target.value)}
                                          className={cn(
                                            "h-8 text-sm",
                                            isWallpaperActive
                                              ? "border-white/40 bg-white/10 text-white placeholder:text-white/50"
                                              : "",
                                          )}
                                          autoFocus
                                        />
                                      ) : (
                                        <span
                                          className={cn(
                                            "flex-1 leading-relaxed",
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
                                              "h-7 w-7 text-emerald-600 hover:text-emerald-700",
                                              isWallpaperActive ? "hover:bg-white/20" : "",
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
                                              "h-7 w-7 text-muted-foreground hover:text-destructive",
                                              isWallpaperActive ? "hover:bg-white/20" : "",
                                            )}
                                          >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Cancel editing mini task</span>
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleStartEditMinor(major.id, minor.id, minor.title)}
                                          className={cn(
                                            "h-7 w-7 text-muted-foreground hover:text-primary",
                                            isWallpaperActive ? "hover:bg-white/20" : "",
                                          )}
                                        >
                                          <Pencil className="h-4 w-4" />
                                          <span className="sr-only">Edit mini task title</span>
                                        </Button>
                                      )}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteMinor(major.id, minor.id)}
                                        className={cn(
                                          "h-7 w-7 text-muted-foreground hover:text-destructive",
                                          isWallpaperActive ? "hover:bg-white/20" : "",
                                        )}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove mini task</span>
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                          <Input
                            value={newMinorInputs[major.id] ?? ""}
                            onChange={(event) =>
                              setNewMinorInputs((prev) => ({ ...prev, [major.id]: event.target.value }))
                            }
                            placeholder="Add a mini task"
                            className={cn(
                              "flex-1 h-11 text-base",
                              isWallpaperActive
                                ? "border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                : "",
                            )}
                          />
                          <Button
                            type="button"
                            size="lg"
                            className={cn(
                              "shrink-0 px-5 text-base sm:w-auto w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
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
                                <span className={cn("text-sm", isWallpaperActive ? "text-emerald-200" : "text-emerald-600")}>Done</span>
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
                                onClick={() => handleDeletePastMajor(task.id)}
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
                                  ? "text-emerald-200"
                                  : "text-emerald-600"
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
                                ? "border-emerald-500 bg-emerald-500 text-white"
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
    </div>
  );
};

export default FocusLearning;
