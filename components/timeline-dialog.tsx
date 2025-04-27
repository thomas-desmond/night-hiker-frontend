import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { HikingDate } from "@/types/hiking";
import AstronomicalTimeline from "./astronomical-timeline/timeline";

interface TimelineDialogProps {
  date: HikingDate;
  trigger?: React.ReactNode;
}

export function TimelineDialog({ date, trigger }: TimelineDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost">Timeline</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Timeline for {date.date.toFormat("MMMM dd, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AstronomicalTimeline date={date} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 