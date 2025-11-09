import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type ColorVisionMode = "default" | "red-green" | "blue-yellow";

type ColorVisionContextValue = {
  mode: ColorVisionMode;
  setMode: (mode: ColorVisionMode) => void;
};

const ColorVisionContext = createContext<ColorVisionContextValue | undefined>(undefined);

const STORAGE_KEY = "study-buddy-color-vision";

export const ColorVisionProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ColorVisionMode>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ColorVisionMode | null;
      if (stored && ["default", "red-green", "blue-yellow"].includes(stored)) {
        return stored;
      }
    }
    return "default";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (mode === "default") {
        document.documentElement.removeAttribute("data-color-vision");
      } else {
        document.documentElement.setAttribute("data-color-vision", mode);
      }
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: setModeState,
    }),
    [mode]
  );

  return <ColorVisionContext.Provider value={value}>{children}</ColorVisionContext.Provider>;
};

export const useColorVision = () => {
  const context = useContext(ColorVisionContext);
  if (!context) {
    throw new Error("useColorVision must be used within a ColorVisionProvider");
  }
  return context;
};
