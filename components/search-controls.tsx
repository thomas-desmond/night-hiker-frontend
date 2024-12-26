"use client";

import { Card } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { LocationSearch } from "@/components/location-search";
import type { DateRange } from "@/types/hiking";
import type { Location } from "@/types/location";

interface SearchControlsProps {
  dateRange: DateRange;
  location: Location;
  onDateRangeChange: (range: DateRange) => void;
  onLocationChange: (location: Location) => void;
}

export function SearchControls({
  dateRange,
  location,
  onDateRangeChange,
  onLocationChange,
}: SearchControlsProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <LocationSearch 
          selected={location} 
          onSelect={onLocationChange} 
        />
        <DateRangePicker 
          date={dateRange} 
          onSelect={onDateRangeChange} 
        />
      </div>
    </Card>
  );
}