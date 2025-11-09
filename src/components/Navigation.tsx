import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Target, Briefcase, Globe, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const colorVisionOptions: { value: ColorVisionMode; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "red-green", label: "Red-Green" },
    { value: "blue-yellow", label: "Blue-Yellow" },
  ];
  
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);
  
  const navItems = [
    { path: "/overseas-exchange", label: "Overseas Exchange", icon: Globe },
    { path: "/job-information", label: "Job Information", icon: Briefcase },
    { path: "/focus-learning", label: "Focus Learning", icon: Target },
    { path: "/community", label: "Community", icon: Users },
  ];
  
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
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                asChild
                variant="ghost"
                className={cn(
                  "gap-2 border border-primary transition-smooth hover:-translate-y-0.5",
                  active
                    ? "h-14 px-7 bg-primary text-primary-foreground ring-2 ring-primary/50 shadow-md shadow-primary/40 !hover:bg-primary-hover !hover:text-primary-foreground"
                    : "h-10 px-4 bg-primary text-primary-foreground !hover:bg-primary-hover !hover:text-primary-foreground"
                )}
              >
                <Link to={item.path} aria-current={active ? "page" : undefined}>
                  <Icon className="h-4 w-4" />
                  <span
                    className={cn(
                      "transition-smooth",
                      active ? "text-lg font-semibold" : "text-sm font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden sm:inline-flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <span className="text-sm">Color Vision</span>
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
