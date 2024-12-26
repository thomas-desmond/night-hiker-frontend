import { HikingDate } from "@/types/hiking";
import { DateTime } from "luxon";
import { start } from "repl";
import { getMoonIllumination, getMoonTimes, getTimes } from "suncalc"; // Install suncalc: `npm install suncalc`

interface NightHikingConditions {
  latitude: number;
  longitude: number;
  timezone: string; // E.g., "America/Los_Angeles"
  minIllumination: number; // e.g., 90%
  startHikeTime: string; // HH:mm in local timezone
  endHikeTime: string; // HH:mm in local timezone
}

interface NightHikingResult {
  date: DateTime; // Local time
  isGoodForHiking: "Yes" | "No" | "Partial";
  moonIllumination: number;
  moonrise?: DateTime;
  moonset?: DateTime;
  moonZenith?: DateTime;
  sunset?: DateTime;
  reason: string;
}

export function checkHikingConditionsInRange(
  startDate: DateTime,
  endDate: DateTime,
  conditions: NightHikingConditions
): HikingDate[] {
  const results: HikingDate[] = [];

  // // Ensure dates are in the user's local timezone
  // const localStartDate = startDate.setZone(conditions.timezone, {
  //   keepLocalTime: true,
  // });
  // const localEndDate = endDate.setZone(conditions.timezone, {
  //   keepLocalTime: true,
  // });

  // Iterate over the range of dates
  for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
    // Convert local date to UTC for suncalc (which requires UTC input)
    const utcDate = date.toUTC();

    // Get Moon illumination
    const moonIllumination =
      getMoonIllumination(utcDate.toJSDate()).fraction * 100; // Converts to percentage

    // Get Moon times (using UTC input but converting results to local timezone)
    const moonTimes = getMoonTimes(
      utcDate.toJSDate(),
      conditions.latitude,
      conditions.longitude
    );

    let moonrise = moonTimes.rise
      ? DateTime.fromJSDate(moonTimes.rise).setZone(conditions.timezone)
      : undefined;
    let moonset = moonTimes.set
      ? DateTime.fromJSDate(moonTimes.set).setZone(conditions.timezone)
      : undefined;

    // If moonset is before moonrise, get moonset time for the next day
    if (moonset && moonrise && moonset < moonrise) {
      const nextDayMoonTimes = getMoonTimes(
        utcDate.plus({ days: 1 }).toJSDate(),
        conditions.latitude,
        conditions.longitude
      );
      moonset = nextDayMoonTimes.set
        ? DateTime.fromJSDate(nextDayMoonTimes.set).setZone(conditions.timezone)
        : undefined;
    }

    // Calculate zenith time if both rise and set are available
    let moonZenith: DateTime | undefined = undefined;
    if (moonrise && moonset) {
      const midTime = moonrise.plus({
        milliseconds: moonset.diff(moonrise).milliseconds / 2,
      });
      moonZenith = midTime;
    }

    // Get sunset time (using UTC input but converting to local timezone)
    const sunTimes = getTimes(
      utcDate.toJSDate(),
      conditions.latitude,
      conditions.longitude
    );
    const sunset = sunTimes.sunset
      ? DateTime.fromJSDate(sunTimes.sunset).setZone(conditions.timezone)
      : undefined;

    // Convert moon times to local timezone
    const moonriseLocal = moonrise
      ? moonrise.setZone(conditions.timezone)
      : null;
    const moonsetLocal = moonset ? moonset.setZone(conditions.timezone) : null;
    // Ensure moonrise or moonset overlaps with hike time

    const startHikeTime = DateTime.fromObject(
      {
        year: moonriseLocal?.year,
        month: moonriseLocal?.month,
        day: moonriseLocal?.day,
        hour: 20,
        minute: 0,
      },
      { zone: conditions.timezone }
    );

    const endHikeTime = DateTime.fromObject(
      {
        year: moonriseLocal?.year,
        month: moonriseLocal?.month,
        day: moonriseLocal?.day,
        hour: 23,
        minute: 59,
      },
      { zone: conditions.timezone }
    );
    console.log("Moon Illum: ", moonIllumination);
    console.log("Moon Rise: ", moonriseLocal);
    console.log("Moon Set: ", moonsetLocal);
    console.log("Sun Set: ", sunset);
    console.log("Start Hike Time: ", startHikeTime);
    console.log("End Hike Time: ", endHikeTime);
    console.log("\n\n");

    const isMoonVisibleBeforeHike =
      moonriseLocal &&
      moonriseLocal <= startHikeTime &&
      moonsetLocal &&
      moonsetLocal >= endHikeTime;

    const isMoonVisibleDuringHike =
      moonriseLocal &&
      moonriseLocal >= startHikeTime &&
      moonriseLocal <= endHikeTime;



    let isGoodForHiking: "Yes" | "No" | "Partial" = "Yes";
    let reason = "The Moon meets visibility and illumination requirements.";

    if (isMoonVisibleDuringHike && !isMoonVisibleBeforeHike) {
      isGoodForHiking = "Partial";
      reason = "The Moon rises during your hike so maybe a good night.";
    } else if (!isMoonVisibleBeforeHike) {
      isGoodForHiking = "No";
      reason = "The Moon is not visible during the planned hike time.";
    } else if (moonIllumination < conditions.minIllumination) {
      isGoodForHiking = "No";
      reason = `The Moon's illumination is below the required ${conditions.minIllumination}%.`;
    }

    results.push({
      date, 
      moonIllumination,
      moonRiseTime: moonrise,
      moonSetTime: moonset,
      sunsetTime: sunset,
      isGoodForHiking,
      zenithTime: moonZenith,
      reason,
    });
  }

  return results;
}

export function simpleMoonTimes(
  date: DateTime,
  conditions: NightHikingConditions
) {
  // Convert the input date to UTC
  const utcDate = date.toUTC();

  // const utcDate = DateTime.fromJSDate(date, { zone: 'utc' });

  // Get moon times in UTC
  const moonTimes = getMoonTimes(
    utcDate.toJSDate(),
    conditions.latitude,
    conditions.longitude
  );
  let moonrise = moonTimes.rise
    ? DateTime.fromJSDate(moonTimes.rise).setZone(conditions.timezone)
    : undefined;
  let moonset = moonTimes.set
    ? DateTime.fromJSDate(moonTimes.set).setZone(conditions.timezone)
    : undefined;

  if (moonrise && moonset && moonset < moonrise) {
    const nextDayMoonTimes = getMoonTimes(
      utcDate.plus({ days: 1 }).toJSDate(),
      conditions.latitude,
      conditions.longitude
    );
    moonset = nextDayMoonTimes.set
      ? DateTime.fromJSDate(nextDayMoonTimes.set).setZone(conditions.timezone)
      : undefined;
  }

  // Convert moon times to local timezone
  const moonriseLocal = moonrise ? moonrise.setZone(conditions.timezone) : null;
  const moonsetLocal = moonset ? moonset.setZone(conditions.timezone) : null;

  return {
    rise: moonriseLocal,
    set: moonsetLocal,
  };
}
