import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Moon, Clock } from "lucide-react";
import type { HikingDate } from "@/types/hiking";
import { TimelinePopover } from "./timeline-popover";
import { cn } from "@/lib/utils";

interface HikingDateListProps {
  dates: HikingDate[];
}

export function HikingDateList({ dates }: HikingDateListProps) {
  return (
    <div className="w-full">
      <div className="min-w-full table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] sm:w-auto">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Illumination</TableHead>
            <TableHead className="hidden md:table-cell">Best Hiking Window</TableHead>
            <TableHead className="w-[60%] sm:w-auto">Quality</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium break-words">
                <div className="flex flex-col gap-1">
                  <span>{date.date.toFormat("LLLL d, yyyy")}</span>
                  <div className="flex items-center gap-1 sm:hidden text-sm text-muted-foreground">
                    <Moon className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">{Math.round(date.moonIllumination)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  {Math.round(date.moonIllumination)}%
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell whitespace-nowrap">
                {date.isGoodForHiking !== "No" && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {date.moonRiseTime?.plus({ hours: 1 }).toFormat("HH:mm")} - {date.moonSetTime?.minus({ hours: 1 }).toFormat("HH:mm")}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className={cn(
                    "inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit",
                    date.isGoodForHiking === "Yes"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100"
                      : date.isGoodForHiking === "Partial"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100"
                  )}>
                    {date.isGoodForHiking === "Yes"
                      ? "Good"
                      : date.isGoodForHiking === "Partial"
                      ? "Okay"
                      : "Poor"}
                  </div>
                  {date.isGoodForHiking !== "No" && (
                    <div className="md:hidden text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">
                          {date.moonRiseTime?.plus({ hours: 1 }).toFormat("HH:mm")} - {date.moonSetTime?.minus({ hours: 1 }).toFormat("HH:mm")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                <TimelinePopover date={date} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </div>
    </div>
  );
} 