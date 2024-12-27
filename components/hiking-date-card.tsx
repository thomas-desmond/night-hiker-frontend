"use client";

import { Calendar, Clock, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HikingDate } from "@/types/hiking";
import { Timeline } from "@/components/timeline";

interface HikingDateCardProps {
  date: HikingDate;
}

export function HikingDateCard({ date }: HikingDateCardProps) {
  return (
    <Card
      className={`p-6 shadow-lg transition-all hover:shadow-xl ${
        date.isGoodForHiking === "Yes"
          ? "border-l-4 border-l-green-500 dark:border-l-green-400 bg-card/50"
          : date.isGoodForHiking === "Partial"
          ? "border-l-4 border-l-yellow-500 dark:border-l-yellow-400 bg-card/50"
          : "border border-border/50"
      }`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              {date.date.toFormat("MMMM dd, yyyy")}
            </h3>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Moon className="w-5 h-5" />
              {Math.round(date.moonIllumination)}% illumination
            </p>
          </div>
            <div className="relative group">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
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
              ? "Okay at Certain Times"
              : "Not Recommended"}
            </div>
            {date.reason && (
              <div className="z-10 absolute left-0 mt-2 w-64 p-2 bg-white dark:bg-gray-800 text-sm text-muted-foreground border border-border/50 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {date.reason}
              </div>
            )}
            </div>
        </div>

        <Timeline date={date} />

        {date.isGoodForHiking != "No" && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-900">
            <p className="text-green-800 dark:text-green-100 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Best hiking window: {date.moonRiseTime ? date.moonRiseTime.plus({ hours: 1 }).toFormat("hh:mm a") : "N/A"} - {date.moonSetTime ? date.moonSetTime.minus({ hours: 1 }).toFormat("hh:mm a") : "N/A"}
              
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
