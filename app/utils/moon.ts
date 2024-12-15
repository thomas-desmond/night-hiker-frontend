import moment from "moment-timezone";
import SunCalc from "suncalc";
import { Coordinates } from "../types/Coordinates";
import { FavorableMoon } from "../types/FavorableMoon";
import { ZenithResult } from "../types/Zenith";
import { DateTime } from "luxon";

function getMoonIllumination(date: Date): number {
  const moonIllumination = SunCalc.getMoonIllumination(date);
  return moonIllumination.fraction * 100; // Convert tnpm i --save-dev @types/astronomiao percentage
}

function isMoonVisible(
  coords: Coordinates,
  date: Date,
  timezone: string
): boolean {
  // 1. Calculate sunset and moonrise in UTC
  const sunTimes = SunCalc.getTimes(date, coords.lat, coords.lon);
  const moonTimes = SunCalc.getMoonTimes(date, coords.lat, coords.lon);

  const dateTime = DateTime.now().setZone(timezone);
  const offsetInHours = dateTime.offset / 60;
  console.log("RISEEEE ", moonTimes.rise);
  const moonriseHours = moonTimes.rise.getHours();

  let adjustDay = false;
  if (moonriseHours - offsetInHours < 0) {
    adjustDay = true;
  }

  // 3. Convert sunset and moonrise to local timezone
  const sunsetLocal = DateTime.fromJSDate(sunTimes.sunset).setZone(timezone);
  let moonriseLocal = DateTime.fromJSDate(moonTimes.rise).setZone(timezone);

  if (adjustDay) {
    moonriseLocal = moonriseLocal.minus({ days: 1 });
  }

  console.log(
    "sunset",
    sunsetLocal.toISO(),
    "\nmoonrise",
    moonriseLocal.toISO()
  );

  const diffInMinutes = moonriseLocal
    .diff(sunsetLocal, "minutes")
    .as("minutes");
  if (diffInMinutes < 0 && diffInMinutes > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

  return false;

  // const currentTimeAtB = DateTime.fromISO(date.toISOString(), { zone: timezone })

  // const sunTimes = SunCalc.getTimes(currentTimeAtB.toJSDate(), coords.lat, coords.lon);
  // const moonTimes = SunCalc.getMoonTimes(currentTimeAtB.toJSDate(), coords.lat, coords.lon);

  // if (!moonTimes.rise || !moonTimes.set) {
  //     return false;
  // }

  // const sunset =  DateTime.fromISO(sunTimes.sunset.toISOString(), { zone: timezone }).toJSDate()
  // const moonrise =  DateTime.fromISO(moonTimes.rise.toISOString(), { zone: timezone }).toJSDate()

  // const newSunset = moment(sunset).subtract(8, 'hour').toDate()
  // const newMoonrise =  moment(moonrise).subtract(8, 'hour').toDate()

  // const moonriseMinutesBeforeSunset = (newMoonrise.getTime() - newSunset.getTime()) / (1000 * 60);
  // if (moonriseMinutesBeforeSunset < 0 && moonriseMinutesBeforeSunset > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

  // const diffInMinutes = moonrise.diff(sunset, 'minutes').as('minutes');
  // console.log('sunset', sunset.toISO(),  '\nmoonrise', moonrise.toISO()," ", diffInMinutes)

  // const moonriseMinutesBeforeSunset = (moonrise.getTime() - sunset.getTime()) / (1000 * 60);
  // if (diffInMinutes < 0 && diffInMinutes > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

  return false;
}

// function isMoonVisible(coords: Coordinates, date: Date, timezone: string): boolean {
//     const currentTimeAtB = DateTime.fromISO(date.toISOString(), { zone: timezone });

//     // Calculate the sun's position
//     const sunPos = solar.apparentPosition(currentTimeAtB.toJSDate(), coords.lat, coords.lon);

//     // Calculate the moon's position
//     const moonPos = moonposition.position(currentTimeAtB.toJSDate());
//     const moonTimes = {
//         rise: moonPos.rise(coords.lat, coords.lon),
//         set: moonPos.set(coords.lat, coords.lon),
//     };

//     if (!moonTimes.rise || !moonTimes.set) {
//         return false;
//     }

//     const sunset = DateTime.fromISO(sunPos.sunset.toISOString(), { zone: timezone });
//     const moonrise = DateTime.fromISO(moonTimes.rise.toISOString(), { zone: timezone });
//     sunset

//     const diffInMinutes = moonrise.diff(sunset, 'minutes').as('minutes');
//     console.log('sunset', sunset.toISO(), '\nmoonrise', moonrise.toISO(), " ", diffInMinutes);

//     if (diffInMinutes < 0 && diffInMinutes > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

//     return false;
// }

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

  // If end time is earlier than start time, add one day to end time
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
    currentTime.add(1, "minute"); // Adjust the interval as needed
  }

  const determinedZenithTime: ZenithResult = {
    time: zenithTime,
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
        const favorableMoon: FavorableMoon = {
          date: currentDate.toDate(),
          illuminationPercentage: illumination,
          moonriseTime: SunCalc.getMoonTimes(
            currentDate.toDate(),
            coords.lat,
            coords.lon
          ).rise,
          moonsetTime: SunCalc.getMoonTimes(
            currentDate.toDate(),
            coords.lat,
            coords.lon
          ).set,
          sunsetTime: SunCalc.getTimes(
            currentDate.toDate(),
            coords.lat,
            coords.lon
          ).sunset,
        };

        const moonriseTimeHHMM = favorableMoon.moonriseTime
          .toTimeString()
          .slice(0, 5);
        const moonsetTimeHHMM = favorableMoon.moonsetTime
          .toTimeString()
          .slice(0, 5);
        // TODO: This is time consuming, consider optimizing
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
