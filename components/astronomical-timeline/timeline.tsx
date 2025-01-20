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
      type: "sunset",
      datetime: date.sunsetTime.toJSDate(),
    },
    {
      type: "moonrise",
      datetime: date.moonRiseTime.toJSDate(),
    },
    {
      type: "moonpeak",
      datetime: date.zenithTime.toJSDate(),
    },
    {
      type: "moonset",
      datetime: date.moonSetTime.toJSDate(),
    },
  ] as const;

  const [sortedEvents, setSortedEvents] = useState<AstronomicalEvent[]>([]);

  useEffect(() => {
    setSortedEvents(sortEvents(events));
  }, [events]);

  if (sortedEvents.length === 0) return null;

  return (
    <div className="w-full bg-black rounded-xl text-white px-6 py-4">
      <div className="relative grid grid-cols-4 gap-4">
        {/* Timeline line */}
        <div className="absolute top-[5px] left-0 right-0 h-px bg-white/20" />

        {/* Events */}
        {sortedEvents.map((event, index) => (
          <div key={index} className="flex flex-col items-center pt-0">
            {/* Dot */}
            <div className="w-2 h-2 bg-white rounded-full mb-3" />

            {/* Label */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span>{getEventEmoji(event.type)}</span>
                <span>{getEventLabel(event.type)}</span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(event.datetime)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
