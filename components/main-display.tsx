"use client";
import { useState } from "react";
import { LocationHeader } from "@/components/location-header";
import { SearchControls } from "@/components/search-controls";
import { IlluminationControls } from "@/components/illumination-controls";
import { HikingDateCard } from "@/components/hiking-date-card";
import { ActivityModeToggle } from "@/components/activity-mode-toggle";
import type { HikingDate, DateRange, ActivityMode } from "@/types/hiking";
import { DateTime } from "luxon";
import type { Location } from "@/types/location";

export default function MainDisplay({
  hikingDates,
}: {
  hikingDates: HikingDate[];
}) {

    
  const [location, setLocation] = useState<Location>({
    id: "1",
    name: "Escondido",
    region: "CA",
    lat: 33.0893,
    long: -117.1153,
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  const [illuminationThreshold, setIlluminationThreshold] = useState(80);
  const [showOnlyGoodDates, setShowOnlyGoodDates] = useState(true);
  const [mode, setMode] = useState<ActivityMode>("hiking");

  const filteredDates = showOnlyGoodDates
    ? hikingDates.filter((date) => {
        if (mode === "hiking") {
          return date.isGoodForHiking === "Yes" || date.isGoodForHiking === "Partial";
        } else {
          return date.isGoodForStarGazing === "Yes" || date.isGoodForStarGazing === "Partial";
        }
      })
    : hikingDates;

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <LocationHeader />

      <main className="max-w-4xl mx-auto space-y-6">
        <SearchControls
          location={location}
          dateRange={dateRange}
          onLocationChange={setLocation}
          onDateRangeChange={setDateRange}
        />

        <ActivityModeToggle mode={mode} onModeChange={setMode} />

        <IlluminationControls
          illuminationThreshold={illuminationThreshold}
          showOnlyGoodDates={showOnlyGoodDates}
          onIlluminationChange={setIlluminationThreshold}
          onShowGoodDatesChange={setShowOnlyGoodDates}
        />

        <div className="space-y-4">
          {filteredDates.map((date, index) => (
            <HikingDateCard key={index} date={date} mode={mode} />
          ))}
        </div>
      </main>
    </div>
  );
}
