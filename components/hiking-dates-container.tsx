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
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <SearchControls
          location={location}
          dateRange={dateRange}
          onLocationChange={setLocation}
          onDateRangeChange={setDateRange}
        />
        <IlluminationControls
          illuminationThreshold={illuminationThreshold}
          showOnlyGoodDates={showOnlyGoodDates}
          onIlluminationChange={setIlluminationThreshold}
          onShowGoodDatesChange={setShowOnlyGoodDates}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-sm text-muted-foreground">Hiking dates</span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-[1600px] mx-auto">
        {filteredDates.length > 0 ? (
          filteredDates.map((date, index) => (
            <HikingDateCard key={index} date={date} />
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}
