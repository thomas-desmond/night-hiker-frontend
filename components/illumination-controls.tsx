"use client";

import { Moon, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IlluminationControlsProps {
  illuminationThreshold: number;
  showOnlyGoodDates: boolean;
  onIlluminationChange: (value: number) => void;
  onShowGoodDatesChange: (value: boolean) => void;
}

export function IlluminationControls({
  illuminationThreshold,
  showOnlyGoodDates,
  onIlluminationChange,
  onShowGoodDatesChange,
}: IlluminationControlsProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Moon Illumination Preferences
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Minimum Illumination: {illuminationThreshold}%</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Higher illumination provides better visibility for night hiking</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="relative">
            <Slider
              value={[illuminationThreshold]}
              onValueChange={(value) => onIlluminationChange(value[0])}
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
            id="show-good-dates"
            checked={showOnlyGoodDates}
            onCheckedChange={onShowGoodDatesChange}
          />
          <Label htmlFor="show-good-dates">Filter for ideal nights</Label>
        </div>
      </div>
    </Card>
  );
}