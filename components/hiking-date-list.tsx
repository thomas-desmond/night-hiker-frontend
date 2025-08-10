"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Moon, Star, Clock, Sunrise } from "lucide-react";
import { HikingDate } from "@/types/hiking";
import { ActivityMode } from "@/types/hiking";

interface HikingDateListProps {
  dates: HikingDate[];
  mode: ActivityMode;
}

export function HikingDateList({ dates, mode }: HikingDateListProps) {
  const isHikingMode = mode === "hiking";
  const activityLabel = isHikingMode ? "Hiking" : "Star Gazing";

  const getStatusColor = (status: "Yes" | "No" | "Partial") => {
    switch (status) {
      case "Yes":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100";
      case "Partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100";
      case "No":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100";
    }
  };

  const getStatusText = (status: "Yes" | "No" | "Partial") => {
    if (isHikingMode) {
      switch (status) {
        case "Yes":
          return "Good for Hiking";
        case "Partial":
          return "Okay for Hiking";
        case "No":
          return "Not Recommended";
      }
    } else {
      switch (status) {
        case "Yes":
          return "Perfect for Star Gazing";
        case "Partial":
          return "Good for Star Gazing";
        case "No":
          return "Poor for Star Gazing";
      }
    }
  };

  return (
    <div className="w-full">
      <div className="min-w-full table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] sm:w-auto">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Illumination</TableHead>
            <TableHead className="hidden md:table-cell">Best Time Window</TableHead>
            <TableHead className="w-[60%] sm:w-auto">{activityLabel} Quality</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date, index) => {
            const isGoodForActivity = isHikingMode ? date.isGoodForHiking : date.isGoodForStarGazing;
            const reason = isHikingMode ? date.reason : date.starGazingReason;
            
            return (
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
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <div className="flex flex-col">
                      {date.moonRiseTime && (
                        <span>Rise: {date.moonRiseTime.toFormat("HH:mm")}</span>
                      )}
                      {date.moonSetTime && (
                        <span>Set: {date.moonSetTime.toFormat("HH:mm")}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(isGoodForActivity)}>
                    {getStatusText(isGoodForActivity)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right">
                  <div className="text-sm text-muted-foreground max-w-xs">
                    {reason}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </div>
    </div>
  );
} 