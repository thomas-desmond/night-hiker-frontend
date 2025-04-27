import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Moon, Clock } from "lucide-react";
import type { HikingDate } from "@/types/hiking";
import { TimelinePopover } from "./timeline-popover";

interface HikingDateListProps {
  dates: HikingDate[];
}

export function HikingDateList({ dates }: HikingDateListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Illumination</TableHead>
          <TableHead>Best Hiking Window</TableHead>
          <TableHead>Quality</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dates.map((date, index) => (
          <TableRow key={index}>
            <TableCell>{date.date.toFormat("MMM dd, yyyy")}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                {Math.round(date.moonIllumination)}%
              </div>
            </TableCell>
            <TableCell>
              {date.isGoodForHiking !== "No" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {date.moonRiseTime?.plus({ hours: 1 }).toFormat("hh:mm a")} - {date.moonSetTime?.minus({ hours: 1 }).toFormat("hh:mm a")}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                date.isGoodForHiking === "Yes"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100"
                  : date.isGoodForHiking === "Partial"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100"
              }`}>
                {date.isGoodForHiking === "Yes"
                  ? "Good for Hiking"
                  : date.isGoodForHiking === "Partial"
                  ? "Okay for Hiking"
                  : "Not Recommended"}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <TimelinePopover date={date} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 