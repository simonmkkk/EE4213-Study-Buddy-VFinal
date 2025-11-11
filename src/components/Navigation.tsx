import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Target, Briefcase, Globe, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useColorVision, ColorVisionMode } from "@/context/ColorVisionContext";

const Navigation = () => {
  const location = useLocation();
  const { mode, setMode } = useColorVision();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const colorVisionOptions: { value: ColorVisionMode; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "red-green", label: "Red-Green" },
    { value: "blue-yellow", label: "Blue-Yellow" },
  ];
  
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);
  
  const navItems: {
    path: string;
    label: string;
    icon: typeof Globe;
    activeRoot?: string;
  }[] = [
    { path: "/overseas-exchange/visual-explorer", activeRoot: "/overseas-exchange", label: "Overseas Exchange", icon: Globe },
    {
      path: "/job-information/dashboard",
      activeRoot: "/job-information",
      label: "Career Information",
      icon: Briefcase,
    },
    { path: "/focus-learning", label: "Focus Learning", icon: Target },
    { path: "/community", label: "Community", icon: Users },
  ];
  
  // Hide navigation when in fullscreen mode
  if (isFullscreen) {
    return null;
  }
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 transition-smooth hover:-translate-y-0.5 hover:opacity-80"
        >
          <GraduationCap className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">Study Buddy</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const active = isActive(item.activeRoot ?? item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 border",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-foreground border-transparent hover:-translate-y-1 hover:shadow-md hover:border-primary"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden sm:inline-flex items-center gap-2 border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary hover:bg-transparent hover:text-foreground"
            >
              <Palette className="h-5 w-5" />
              <span className="text-sm">Color Blind Mode</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Assistance</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as ColorVisionMode)}
            >
              {colorVisionOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">SB</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;
