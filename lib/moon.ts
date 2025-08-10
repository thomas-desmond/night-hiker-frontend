import { HikingDate } from "@/types/hiking";
import { DateTime } from "luxon";
import { getMoonIllumination, getMoonTimes, getTimes } from "suncalc"; // Install suncalc: `npm install suncalc`

interface NightHikingConditions {
  latitude: number;
  longitude: number;
  timezone: string; // E.g., "America/Los_Angeles"
  minIllumination: number; // e.g., 90%
  startHikeTime: string; // HH:mm in local timezone
  endHikeTime: string; // HH:mm in local timezone
}

interface StarGazingConditions {
  latitude: number;
  longitude: number;
  timezone: string;
  maxIllumination: number; // e.g., 20%
  preferNoMoon: boolean;
  startTime: string; // HH:mm in local timezone
  endTime: string; // HH:mm in local timezone
}

export function checkHikingConditionsInRange(
  startDate: DateTime,
  endDate: DateTime,
  conditions: NightHikingConditions,
  starGazingConditions?: StarGazingConditions
): HikingDate[] {
  const results: HikingDate[] = [];

  // Iterate over the range of dates
  for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
    // Convert local date to UTC for suncalc (which requires UTC input)
    const utcDate = date.toUTC();

    // Get Moon illumination
    const moonIllumination =
      getMoonIllumination(date.toJSDate()).fraction * 100; // Converts to percentage

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
      : undefined;
    const moonsetLocal = moonset ? moonset.setZone(conditions.timezone) : undefined;
    
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
    } 
    
    if (moonIllumination < conditions.minIllumination) {
      isGoodForHiking = "No";
      reason = `The Moon's illumination is below the required ${conditions.minIllumination}%.`;
    }

    // Star gazing logic
    let isGoodForStarGazing: "Yes" | "No" | "Partial" = "No";
    let starGazingReason = "Moon illumination is too high for optimal star gazing.";

    // Use user's preferred star gazing time or default to 9 PM - 2 AM
    const defaultStartHour = 21; // 9 PM
    const defaultEndHour = 2; // 2 AM
    
    const startStarGazingTime = DateTime.fromObject(
      {
        year: moonriseLocal?.year,
        month: moonriseLocal?.month,
        day: moonriseLocal?.day,
        hour: starGazingConditions?.startTime ? parseInt(starGazingConditions.startTime.split(':')[0]) : defaultStartHour,
        minute: starGazingConditions?.startTime ? parseInt(starGazingConditions.startTime.split(':')[1]) : 0,
      },
      { zone: conditions.timezone }
    );

    let endStarGazingTime = DateTime.fromObject(
      {
        year: moonriseLocal?.year,
        month: moonriseLocal?.month,
        day: moonriseLocal?.day,
        hour: starGazingConditions?.endTime ? parseInt(starGazingConditions.endTime.split(':')[0]) : defaultEndHour,
        minute: starGazingConditions?.endTime ? parseInt(starGazingConditions.endTime.split(':')[1]) : 0,
      },
      { zone: conditions.timezone }
    );

    // If end time is before start time, it means it's the next day
    if (endStarGazingTime < startStarGazingTime) {
      endStarGazingTime = endStarGazingTime.plus({ days: 1 });
    }

    // Check if moon is visible during star gazing hours
    const isMoonVisibleDuringStarGazing = 
      moonriseLocal &&
      moonsetLocal &&
      ((moonriseLocal <= startStarGazingTime && moonsetLocal >= startStarGazingTime) ||
       (moonriseLocal <= endStarGazingTime && moonsetLocal >= endStarGazingTime) ||
       (moonriseLocal >= startStarGazingTime && moonriseLocal <= endStarGazingTime));

    // Check if moon rises during star gazing window (this is bad for star gazing)
    // Normalize moonrise time to the same day as the star gazing window for comparison
    const normalizedMoonrise = moonriseLocal ? 
      DateTime.fromObject(
        {
          year: startStarGazingTime.year,
          month: startStarGazingTime.month,
          day: startStarGazingTime.day,
          hour: moonriseLocal.hour,
          minute: moonriseLocal.minute,
        },
        { zone: conditions.timezone }
      ) : undefined;

    // If the normalized moonrise is before the start time, it means it's actually the next day
    // BUT only if the moonrise time is actually in the early morning hours (before 6 AM)
    const isEarlyMorningMoonrise = moonriseLocal && moonriseLocal.hour < 6;
    const adjustedMoonrise = normalizedMoonrise && isEarlyMorningMoonrise && normalizedMoonrise < startStarGazingTime ? 
      normalizedMoonrise.plus({ days: 1 }) : normalizedMoonrise;

    // Normalize moonset time to the same day as the star gazing window for comparison
    const normalizedMoonset = moonsetLocal ? 
      DateTime.fromObject(
        {
          year: startStarGazingTime.year,
          month: startStarGazingTime.month,
          day: startStarGazingTime.day,
          hour: moonsetLocal.hour,
          minute: moonsetLocal.minute,
        },
        { zone: conditions.timezone }
      ) : undefined;

    // If the normalized moonset is before the start time, it means it's actually the next day
    const adjustedMoonset = normalizedMoonset && normalizedMoonset < startStarGazingTime ? 
      normalizedMoonset.plus({ days: 1 }) : normalizedMoonset;

    const isMoonRisingDuringStarGazing = 
      adjustedMoonrise &&
      adjustedMoonrise >= startStarGazingTime && 
      adjustedMoonrise <= endStarGazingTime;

    // Check if moon is not visible at all during dark hours
    // For moon to be completely absent, it must either:
    // 1. Rise after the end of the star gazing window, OR
    // 2. Set before the start of the star gazing window
    const isMoonCompletelyAbsent = 
      !moonriseLocal || 
      !moonsetLocal ||
      (adjustedMoonrise && adjustedMoonrise > endStarGazingTime) || 
      (adjustedMoonset && adjustedMoonset < startStarGazingTime);

    if (isMoonRisingDuringStarGazing) {
      isGoodForStarGazing = "No";
      starGazingReason = `Moon rises at ${adjustedMoonrise?.toFormat("HH:mm")} during your star gazing time - not ideal.`;
    } else if (isMoonCompletelyAbsent) {
      isGoodForStarGazing = "Yes";
      starGazingReason = "Moon is not visible during dark hours - perfect for star gazing!";
    } else if (isMoonVisibleDuringStarGazing && moonIllumination <= 20) {
      isGoodForStarGazing = "Partial";
      starGazingReason = "Moon is visible but illumination is low - decent for star gazing.";
    } else if (isMoonVisibleDuringStarGazing && moonIllumination <= 50) {
      isGoodForStarGazing = "Partial";
      starGazingReason = "Moon is visible and illumination is moderate - acceptable for star gazing.";
    } else if (isMoonVisibleDuringStarGazing) {
      isGoodForStarGazing = "No";
      starGazingReason = `Moon is visible during your star gazing time with ${Math.round(moonIllumination)}% illumination - too bright for optimal star gazing.`;
    } else if (moonIllumination <= 20) {
      isGoodForStarGazing = "Partial";
      starGazingReason = "Moon illumination is low but moon may be visible - decent for star gazing.";
    } else if (moonIllumination <= 50) {
      isGoodForStarGazing = "Partial";
      starGazingReason = "Moon illumination is moderate - acceptable for star gazing.";
    }

    results.push({
      date, 
      moonIllumination,
      moonRiseTime: moonrise,
      moonSetTime: moonset,
      sunsetTime: sunset,
      isGoodForHiking,
      isGoodForStarGazing,
      zenithTime: moonZenith,
      reason,
      starGazingReason,
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
