"use client";

import { Calendar, Clock, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HikingDate } from "@/types/hiking";
import { Timeline } from "@/components/timeline";

interface HikingDateCardProps {
  date: HikingDate;
}

export function HikingDateCard({ date: hikingDate }: HikingDateCardProps) {
  if(!hikingDate) return null;
  return (
    <Card className={`p-6 ${hikingDate.isGoodForHiking ? 'border-l-4 border-l-green-500 dark:border-l-green-400' : ''}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              {hikingDate.date.toFormat("MMMM dd yyyy, hh:mm a")}
            </h3>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Moon className="w-5 h-5" />
                {Math.round(hikingDate.moonIllumination)}% illumination
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-base font-medium ${
            hikingDate.isGoodForHiking 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}>
            {hikingDate.isGoodForHiking ? "Great for Hiking" : "Not Recommended"}
          </div>
        </div>

        <Timeline date={hikingDate} />

        {hikingDate.isGoodForHiking && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <p className="text-green-800 dark:text-green-100 font-medium">
              Best hiking window: 8:00 PM - 10:00 PM
            </p>
          </div>
        )}

        {hikingDate.reason && (
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {hikingDate.reason}
          </p>
        )}
      </div>
    </Card>
  );
}