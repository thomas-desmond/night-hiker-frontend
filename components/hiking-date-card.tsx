"use client";

import { Calendar, Clock, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HikingDate } from "@/types/hiking";
import AstronomicalTimeline from "./astronomical-timeline/timeline";

interface HikingDateCardProps {
  date: HikingDate;
}

export function HikingDateCard({ date }: HikingDateCardProps) {
  return (
    <Card className="group transition-all hover:ring-2 hover:ring-primary/20">
      {/* Main Content */}
      <div className={`p-4 ${
        date.isGoodForHiking === "Yes"
          ? "bg-gradient-to-br from-green-500/10 to-green-500/5"
          : date.isGoodForHiking === "Partial"
          ? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5"
          : "bg-gradient-to-br from-red-500/10 to-red-500/5"
      }`}>
        {/* Date and Status */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold">
              {date.date.toFormat("MMM dd")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {date.date.toFormat("yyyy")}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              date.isGoodForHiking === "Yes"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100"
                : date.isGoodForHiking === "Partial"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100"
            }`}
          >
            {date.isGoodForHiking === "Yes"
              ? "Good for Hiking"
              : date.isGoodForHiking === "Partial"
              ? "Partially Good"
              : "Not Recommended"}
          </div>
        </div>

        {/* Moon Info */}
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-4 h-4" />
          <div className="text-sm font-medium">
            {Math.round(date.moonIllumination)}% illumination
          </div>
        </div>

        {/* Best Time Window - Only show if good or partial */}
        {date.isGoodForHiking !== "No" && (
          <div className="mb-2 text-sm">
            <div className="font-medium text-muted-foreground mb-1">Best hiking window</div>
            <div className="flex items-center gap-2 text-base font-semibold">
              <Clock className="w-4 h-4" />
              {date.moonRiseTime?.plus({ hours: 1 }).toFormat("hh:mm a")} - {date.moonSetTime?.minus({ hours: 1 }).toFormat("hh:mm a")}
            </div>
          </div>
        )}
      </div>

      {/* Timeline - Show on hover for desktop, always visible on mobile */}
      <div className="hidden sm:group-hover:block border-t">
        <AstronomicalTimeline date={date} />
      </div>
      <div className="block sm:hidden border-t">
        <AstronomicalTimeline date={date} />
      </div>
    </Card>
  );
}
