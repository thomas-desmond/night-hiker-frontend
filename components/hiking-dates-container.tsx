"use client";
import { useState } from "react";
import { SearchControls } from "@/components/search-controls";
import { IlluminationControls } from "@/components/illumination-controls";
import { HikingDateCard } from "@/components/hiking-date-card";
import type { HikingDate, DateRange } from "@/types/hiking";
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

  const conditions = {
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

  const [illuminationThreshold, setIlluminationThreshold] = useState(80);
  const [showOnlyGoodDates, setShowOnlyGoodDates] = useState(true);

  const startDate = DateTime.fromJSDate(dateRange.from).setZone(timezone);
  const endDate = DateTime.fromJSDate(dateRange.to as Date).setZone(timezone);

  // Mock data - replace with your actual data fetching logic
  const hikingDates: HikingDate[] = checkHikingConditionsInRange(
    startDate,
    endDate,
    conditions
  );

  const filteredDates = showOnlyGoodDates
    ? hikingDates.filter(
        (date) =>
          date.isGoodForHiking === "Yes" || date.isGoodForHiking === "Partial"
      )
    : hikingDates;

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <main className="max-w-4xl mx-auto space-y-6">
        <SearchControls
          location={location}
          dateRange={dateRange}
          onLocationChange={setLocation}
          onDateRangeChange={setDateRange}
        />

        <div className="grid gap-6 md:grid-cols-1">
          <IlluminationControls
            illuminationThreshold={illuminationThreshold}
            showOnlyGoodDates={showOnlyGoodDates}
            onIlluminationChange={setIlluminationThreshold}
            onShowGoodDatesChange={setShowOnlyGoodDates}
          />
          {/* <HikingCalendar /> */}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="h-px bg-border dark:bg-zinc-700 flex-grow" />
          <div className="w-2 h-2 rounded-full bg-border dark:bg-zinc-700" />
          <div className="h-px bg-border dark:bg-zinc-700 flex-grow" />
        </div>
        <div className="space-y-6">
          {filteredDates.length > 0 ? (
            filteredDates.map((date, index) => (
              <HikingDateCard key={index} date={date} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
}
