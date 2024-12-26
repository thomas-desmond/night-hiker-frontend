"use client";

import { HikingDate } from "@/types/hiking";

interface TimelineProps {
  date: HikingDate;
}

export function Timeline({ date }: TimelineProps) {
  return (
    <div className="relative h-16 bg-muted rounded-lg p-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-1 bg-border" />
      </div>
      <div className="relative flex justify-between text-xs">
        <TimelineEvent time={date.sunsetTime ? date.sunsetTime.toFormat("MMMM dd yyyy, hh:mm a") : "N/A"} label="Sunset" />
        <TimelineEvent time={date.moonRiseTime ? date.moonRiseTime.toFormat("MMMM dd yyyy, hh:mm a") : "N/A"} label="Moonrise" />
        <TimelineEvent time={date.zenithTime ? date.zenithTime.toFormat("MMMM dd yyyy, hh:mm a") : "N/A"}  label="Moon Peak" />
        <TimelineEvent time={date.moonSetTime ? date.moonSetTime.toFormat("MMMM dd yyyy, hh:mm a") : "N/A"}  label="Moonset" />
      </div>
    </div>
  );
}

function TimelineEvent({ time, label }: { time: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 rounded-full bg-primary mb-1" />
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">
        {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}