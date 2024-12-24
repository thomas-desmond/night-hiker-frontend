import { Illumination } from "astronomy-engine";
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

interface NightHikingResult {
  date: DateTime; // Local time
  goodForHiking: "Yes" | "No" | "Partial";
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
): NightHikingResult[] {
  const results: NightHikingResult[] = [];

  // Ensure dates are in the user's local timezone
  const localStartDate = startDate.setZone(conditions.timezone, {
    keepLocalTime: true,
  });
  const localEndDate = endDate.setZone(conditions.timezone, {
    keepLocalTime: true,
  });

  // Iterate over the range of dates
  for (
    let date = localStartDate;
    date <= localEndDate;
    date = date.plus({ days: 1 })
  ) {
    // Calculate start and end times for the hike in local timezone
    const startHikeTime = date.set({
      hour: parseInt(conditions.startHikeTime.split(":")[0], 10),
      minute: parseInt(conditions.startHikeTime.split(":")[1], 10),
    });

    const endHikeTime = date.set({
      hour: parseInt(conditions.endHikeTime.split(":")[0], 10),
      minute: parseInt(conditions.endHikeTime.split(":")[1], 10),
    });

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

    // Ensure moonrise or moonset overlaps with hike time
    console.log("Moon Illum: ", moonIllumination);
    console.log("Moon Rise: ", moonrise);
    console.log("Moon Set: ", moonset);
    console.log("Sun Set: ", sunset);
    console.log("Start Hike Time: ", startHikeTime);
    console.log("End Hike Time: ", endHikeTime);
    console.log("\n\n");

    const isMoonVisibleBeforeHike =
      moonrise &&
      moonrise <= startHikeTime &&
      moonset &&
      moonset >= endHikeTime;

    const isMoonVisibleDuringHike =
      moonrise && moonrise >= startHikeTime && moonrise <= endHikeTime;

    let goodForHiking: "Yes" | "No" | "Partial" = "Yes";
    let reason = "The Moon meets visibility and illumination requirements.";

    if (isMoonVisibleDuringHike && !isMoonVisibleBeforeHike) {
      goodForHiking = "Partial";
      reason = "The Moon rises during your hike so maybe a good night.";
    } else if (!isMoonVisibleBeforeHike) {
      goodForHiking = "No";
      reason = "The Moon is not visible during the planned hike time.";
    } else if (moonIllumination < conditions.minIllumination) {
      goodForHiking = "No";
      reason = `The Moon's illumination is below the required ${conditions.minIllumination}%.`;
    }

    results.push({
      date, // Local date
      goodForHiking,
      moonIllumination,
      moonrise,
      moonset,
      moonZenith,
      sunset,
      reason,
    });
  }

  return results;
}
