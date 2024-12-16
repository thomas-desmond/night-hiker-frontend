import moment from "moment-timezone";
import SunCalc from "suncalc";
import { Coordinates } from "../types/Coordinates";
import { FavorableMoon } from "../types/FavorableMoon";
import { ZenithResult } from "../types/Zenith";
import { DateTime } from "luxon";

function getMoonIllumination(date: Date): number {
  const moonIllumination = SunCalc.getMoonIllumination(date);
  return moonIllumination.fraction * 100;
}

function isMoonVisible(
  coords: Coordinates,
  date: Date,
  timezone: string
): boolean {

  const sunTimes = SunCalc.getTimes(date, coords.lat, coords.lon);
  const moonTimes = SunCalc.getMoonTimes(date, coords.lat, coords.lon);
  
  console.log("Using Date ", date.getDay(), " and getting moon times ", moonTimes.rise.getDay(), " and set ", moonTimes.set.getDay());

  const sunsetLocal = DateTime.fromJSDate(sunTimes.sunset).setZone(timezone);
  let moonriseLocal = DateTime.fromJSDate(moonTimes.rise).setZone(timezone);

  const adjustDay = moonriseLocal.day !== sunsetLocal.day;

  if (adjustDay) {
    moonriseLocal = moonriseLocal.set({ day: sunsetLocal.day });
  }

  const diffInMinutes = moonriseLocal
    .diff(sunsetLocal, "minutes")
    .as("minutes");
  if (diffInMinutes < 0 && diffInMinutes > -400) return true;

  return false;
}

function findMoonZenith(
  coords: Coordinates,
  date: Date,
  startTime: string,
  endTime: string,
  timezone: string
): ZenithResult {
  const startMoment = moment.tz(date, timezone).set({
    hour: parseInt(startTime.split(":")[0]),
    minute: parseInt(startTime.split(":")[1]),
  });
  const endMoment = moment.tz(date, timezone).set({
    hour: parseInt(endTime.split(":")[0]),
    minute: parseInt(endTime.split(":")[1]),
  });

  if (endMoment.isBefore(startMoment)) {
    endMoment.add(1, "day");
  }

  let highestAltitude = -Infinity;
  let zenithTime: Date = startMoment.toDate();

  const currentTime = startMoment.clone();

  while (currentTime.isSameOrBefore(endMoment)) {
    const moonPosition = SunCalc.getMoonPosition(
      currentTime.toDate(),
      coords.lat,
      coords.lon
    );
    if (moonPosition.altitude > highestAltitude) {
      highestAltitude = moonPosition.altitude;
      zenithTime = currentTime.toDate();
    }
    currentTime.add(3, "minute");
  }

  const determinedZenithTime: ZenithResult = {
    time: DateTime.fromJSDate(zenithTime).setZone(timezone),
    altitude: highestAltitude,
  };
  return determinedZenithTime;
}

export function getFavorableMoonDatesInRange(
  coords: Coordinates,
  startDate: Date,
  endDate: Date,
  timezone: string,
  minIllumination: number = 80
): FavorableMoon[] {
  const currentDate = moment.tz(startDate, timezone);
  const endMoment = moment.tz(endDate, timezone);
  const dateRange: FavorableMoon[] = [];

  while (currentDate.isSameOrBefore(endMoment)) {
    const illumination = getMoonIllumination(currentDate.toDate());
    if (illumination >= minIllumination) {
      if (isMoonVisible(coords, currentDate.toDate(), timezone)) {
        const moonTimesUTC = SunCalc.getMoonTimes(
          currentDate.toDate(),
          coords.lat,
          coords.lon
        );
        const moonriseTimeLocal = DateTime.fromJSDate(
          moonTimesUTC.rise
        ).setZone(timezone);
        const moonsetTimeLocal = DateTime.fromJSDate(moonTimesUTC.set).setZone(
          timezone
        );

        const sunTimes = SunCalc.getTimes(
          currentDate.toDate(),
          coords.lat,
          coords.lon
        );
        const sunsetTimeLocal = DateTime.fromJSDate(sunTimes.sunset).setZone(
          timezone
        );

        const favorableMoon: FavorableMoon = {
          date: currentDate.toDate(),
          illuminationPercentage: illumination,
          moonriseTime: moonriseTimeLocal,
          moonsetTime: moonsetTimeLocal,
          sunsetTime: sunsetTimeLocal,
        };
        const moonriseTimeHHMM = favorableMoon.moonriseTime.toFormat("HH:mm");
        const moonsetTimeHHMM = favorableMoon.moonsetTime.toFormat("HH:mm");
        favorableMoon.zenithTime = findMoonZenith(
          coords,
          currentDate.toDate(),
          moonriseTimeHHMM,
          moonsetTimeHHMM,
          timezone
        );

        dateRange.push(favorableMoon);
      }
    }
    currentDate.add(1, "days");
  }

  return dateRange;
}
