import type { Location } from "./location";
import { DateTime } from "luxon";

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface HikingDate {
  date: DateTime;
  moonIllumination: number;
  moonRiseTime: DateTime | undefined;
  moonSetTime: DateTime | undefined;
  sunsetTime: DateTime | undefined;
  zenithTime: DateTime | undefined;
  isGoodForHiking: "Yes" | "No" | "Partial";
  reason?: string;
}

export interface HikingFilters {
  location: Location;
  dateRange: DateRange;
  illuminationThreshold: number;
  showOnlyGoodDates: boolean;
}