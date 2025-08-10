"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Star, Clock } from "lucide-react";
import { StarGazingTimePreference } from "@/types/hiking";

interface StarGazingControlsProps {
  maxIllumination: number;
  preferNoMoon: boolean;
  showOnlyGoodDates: boolean;
  timePreference: StarGazingTimePreference;
  customStartTime: string;
  customEndTime: string;
  onMaxIlluminationChange: (value: number) => void;
  onPreferNoMoonChange: (value: boolean) => void;
  onShowGoodDatesChange: (value: boolean) => void;
  onTimePreferenceChange: (value: StarGazingTimePreference) => void;
  onCustomStartTimeChange: (value: string) => void;
  onCustomEndTimeChange: (value: string) => void;
}

export function StarGazingControls({
  maxIllumination,
  preferNoMoon,
  showOnlyGoodDates,
  timePreference,
  customStartTime,
  customEndTime,
  onMaxIlluminationChange,
  onPreferNoMoonChange,
  onShowGoodDatesChange,
  onTimePreferenceChange,
  onCustomStartTimeChange,
  onCustomEndTimeChange,
}: StarGazingControlsProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="w-5 h-5" />
          Star Gazing Preferences
        </h2>
        
        {/* Time Preference */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <Label>When do you want to star gaze?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose your preferred star gazing time window</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={timePreference} onValueChange={(value) => onTimePreferenceChange(value as StarGazingTimePreference)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early">Early Evening (8 PM - 11 PM)</SelectItem>
              <SelectItem value="late">Late Night (11 PM - 2 AM)</SelectItem>
              <SelectItem value="custom">Custom Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Time Inputs */}
        {timePreference === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <input
                type="time"
                value={customStartTime}
                onChange={(e) => onCustomStartTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <input
                type="time"
                value={customEndTime}
                onChange={(e) => onCustomEndTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Maximum Illumination: {maxIllumination}%</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lower illumination provides better visibility for star gazing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="relative">
            <Slider
              value={[maxIllumination]}
              onValueChange={(value) => onMaxIlluminationChange(value[0])}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="prefer-no-moon"
            checked={preferNoMoon}
            onCheckedChange={onPreferNoMoonChange}
          />
          <Label htmlFor="prefer-no-moon">Prefer nights when moon is not visible</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-good-star-gazing-dates"
            checked={showOnlyGoodDates}
            onCheckedChange={onShowGoodDatesChange}
          />
          <Label htmlFor="show-good-star-gazing-dates">Filter for ideal nights</Label>
        </div>
      </div>
    </Card>
  );
} 