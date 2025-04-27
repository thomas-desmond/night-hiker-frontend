import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { HikingDate } from "@/types/hiking";
import AstronomicalTimeline from "./astronomical-timeline/timeline";

interface TimelinePopoverProps {
  date: HikingDate;
  className?: string;
}

export function TimelinePopover({ date, className }: TimelinePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`font-medium hover:bg-accent ${className}`}
        >
          <Clock className="mr-2 h-4 w-4" />
          Timeline
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            Timeline for {date.date.toFormat("MMMM dd, yyyy")}
          </h4>
          <AstronomicalTimeline date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
} 