"use client";
import { useState } from "react";
import { SearchControls } from "@/components/search-controls";
import { IlluminationControls } from "@/components/illumination-controls";
import { StarGazingControls } from "@/components/star-gazing-controls";
import { ActivityModeToggle } from "@/components/activity-mode-toggle";
import { HikingDateCard } from "@/components/hiking-date-card";
import { HikingDateList } from "@/components/hiking-date-list";
import { ViewToggle } from "@/components/view-toggle";
import type { HikingDate, DateRange, ActivityMode, StarGazingTimePreference } from "@/types/hiking";
import { checkHikingConditionsInRange } from "@/lib/moon";
import { DateTime } from "luxon";
import type { Location } from "@/types/location";
import { EmptyState } from "@/components/empty-state";
import { HikingCalendar } from "./hiking-calendar";

interface HikingDatesContainerProps {
  latitude: string;
  longitude: string;
  city: string;
  region: string;
  timezone: string;
}

export default function HikingDatesContainer({
  latitude,
  longitude,
  city,
  region,
  timezone,
}: HikingDatesContainerProps) {
  // Default
  if (!latitude || !longitude || !city || !region || !timezone) {
    latitude = "33.0893";
    longitude = "-117.1153";
    city = "Escondido";
    region = "CA";
    timezone = "America/Los_Angeles";
  }

  const hikingConditions = {
    latitude: +latitude,
    longitude: +longitude,
    timezone: timezone,
    minIllumination: 80,
    startHikeTime: "20:00", // 8 PM
    endHikeTime: "23:00", // 11 PM
  };

  const [location, setLocation] = useState<Location>({
    id: "1",
    name: city,
    region: region,
    lat: +latitude,
    long: +longitude,
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
  });

  const [mode, setMode] = useState<ActivityMode>("hiking");
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Hiking controls
  const [illuminationThreshold, setIlluminationThreshold] = useState(80);
  const [showOnlyGoodHikingDates, setShowOnlyGoodHikingDates] = useState(true);
  
  // Star gazing controls
  const [maxIllumination, setMaxIllumination] = useState(20);
  const [preferNoMoon, setPreferNoMoon] = useState(true);
  const [showOnlyGoodStarGazingDates, setShowOnlyGoodStarGazingDates] = useState(true);
  const [timePreference, setTimePreference] = useState<StarGazingTimePreference>("early");
  const [customStartTime, setCustomStartTime] = useState("20:00");
  const [customEndTime, setCustomEndTime] = useState("23:00");

  const startDate = DateTime.fromJSDate(dateRange.from).setZone(timezone);
  const endDate = DateTime.fromJSDate(dateRange.to as Date).setZone(timezone);

  // Get star gazing time window based on preference
  const getStarGazingTimeWindow = () => {
    switch (timePreference) {
      case "early":
        return { startTime: "20:00", endTime: "23:00" };
      case "late":
        return { startTime: "23:00", endTime: "02:00" };
      case "custom":
        return { startTime: customStartTime, endTime: customEndTime };
    }
  };

  const starGazingTimeWindow = getStarGazingTimeWindow();

  // Get all dates with both hiking and star gazing data
  const allDates: HikingDate[] = checkHikingConditionsInRange(
    startDate,
    endDate,
    hikingConditions,
    {
      latitude: +latitude,
      longitude: +longitude,
      timezone: timezone,
      maxIllumination: maxIllumination,
      preferNoMoon: preferNoMoon,
      startTime: starGazingTimeWindow.startTime,
      endTime: starGazingTimeWindow.endTime,
    }
  );

  // Filter dates based on current mode
  const filteredDates = mode === "hiking" 
    ? (showOnlyGoodHikingDates
        ? allDates.filter(
            (date) =>
              date.isGoodForHiking === "Yes" || date.isGoodForHiking === "Partial"
          )
        : allDates)
    : (showOnlyGoodStarGazingDates
        ? allDates.filter(
            (date) =>
              date.isGoodForStarGazing === "Yes" || date.isGoodForStarGazing === "Partial"
          )
        : allDates);

  return (
    <div className="space-y-8">
      {/* Activity Mode Toggle */}
      <div className="flex justify-center">
        <ActivityModeToggle mode={mode} onModeChange={setMode} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between h-full">
          <SearchControls
            location={location}
            dateRange={dateRange}
            onLocationChange={setLocation}
            onDateRangeChange={setDateRange}
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          {mode === "hiking" ? (
            <IlluminationControls
              illuminationThreshold={illuminationThreshold}
              showOnlyGoodDates={showOnlyGoodHikingDates}
              onIlluminationChange={setIlluminationThreshold}
              onShowGoodDatesChange={setShowOnlyGoodHikingDates}
            />
          ) : (
            <StarGazingControls
              maxIllumination={maxIllumination}
              preferNoMoon={preferNoMoon}
              showOnlyGoodDates={showOnlyGoodStarGazingDates}
              timePreference={timePreference}
              customStartTime={customStartTime}
              customEndTime={customEndTime}
              onMaxIlluminationChange={setMaxIllumination}
              onPreferNoMoonChange={setPreferNoMoon}
              onShowGoodDatesChange={setShowOnlyGoodStarGazingDates}
              onTimePreferenceChange={setTimePreference}
              onCustomStartTimeChange={setCustomStartTime}
              onCustomEndTimeChange={setCustomEndTime}
            />
          )}
          <div className="flex justify-end mt-4">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-sm text-muted-foreground">
            {mode === "hiking" ? "Hiking dates" : "Star gazing dates"}
          </span>
        </div>
      </div>

      {filteredDates.length > 0 ? (
        view === "grid" ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-[1600px] mx-auto">
            {filteredDates.map((date, index) => (
              <HikingDateCard key={index} date={date} mode={mode} />
            ))}
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
            <HikingDateList dates={filteredDates} mode={mode} />
          </div>
        )
      ) : (
        <div className="md:col-span-2 xl:col-span-3">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
