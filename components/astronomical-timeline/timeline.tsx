"use client";

import { useEffect, useState } from "react";
import { sortEvents, formatTime, getEventEmoji, getEventLabel } from "./utils";
import { AstronomicalEvent } from "@/types/timelineTypes";
import { HikingDate } from "@/types/hiking";

interface AstronomicalTimelineProps {
  date: HikingDate;
}

export default function AstronomicalTimeline({date}: AstronomicalTimelineProps) {
  if (
    !date.sunsetTime ||
    !date.moonRiseTime ||
    !date.zenithTime ||
    !date.moonSetTime
  )
    return null;

  const events: AstronomicalEvent[] = [
    {
      type: "moonrise",
      datetime: date.moonRiseTime.toJSDate(),
    },
    {
      type: "sunset",
      datetime: date.sunsetTime.toJSDate(),
    },
    {
      type: "moonpeak",
      datetime: date.zenithTime.toJSDate(),
    },
    {
      type: "moonset",
      datetime: date.moonSetTime.toJSDate(),
    },
  ];

  const [sortedEvents, setSortedEvents] = useState<AstronomicalEvent[]>([]);

  useEffect(() => {
    setSortedEvents(sortEvents(events));
  }, [events]);

  if (sortedEvents.length === 0) return null;

  return (
    <div className="p-3 bg-muted/30">
      <div className="text-xs font-medium text-muted-foreground mb-2">Detailed Timeline</div>
      <div className="grid grid-cols-2 gap-2">
        {sortedEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-base">{getEventEmoji(event.type)}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{getEventLabel(event.type)}</div>
              <div className="text-xs text-muted-foreground">
                {formatTime(event.datetime)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
