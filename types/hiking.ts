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
  isGoodForStarGazing: "Yes" | "No" | "Partial";
  reason?: string;
  starGazingReason?: string;
}

export interface HikingFilters {
  location: Location;
  dateRange: DateRange;
  illuminationThreshold: number;
  showOnlyGoodDates: boolean;
}

export interface StarGazingFilters {
  location: Location;
  dateRange: DateRange;
  maxIllumination: number;
  preferNoMoon: boolean;
  showOnlyGoodDates: boolean;
  preferredStartTime: string; // HH:mm format
  preferredEndTime: string; // HH:mm format
}

export type ActivityMode = "hiking" | "starGazing";
export type StarGazingTimePreference = "early" | "late" | "custom";