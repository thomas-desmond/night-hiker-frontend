"use client";

import { Button } from "@/components/ui/button";
import { MountainSnow, Star } from "lucide-react";
import { ActivityMode } from "@/types/hiking";

interface ActivityModeToggleProps {
  mode: ActivityMode;
  onModeChange: (mode: ActivityMode) => void;
}

export function ActivityModeToggle({ mode, onModeChange }: ActivityModeToggleProps) {
  return (
    <div className="flex items-center space-x-2 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === "hiking" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("hiking")}
        className="flex items-center gap-2"
      >
        <MountainSnow className="w-4 h-4" />
        Hiking
      </Button>
      <Button
        variant={mode === "starGazing" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("starGazing")}
        className="flex items-center gap-2"
      >
        <Star className="w-4 h-4" />
        Star Gazing
      </Button>
    </div>
  );
} 