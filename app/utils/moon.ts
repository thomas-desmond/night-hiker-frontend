import moment from 'moment-timezone';
import SunCalc from 'suncalc';
import { Coordinates } from '../types/Coordinates';
import { FavorableMoon } from '../types/FavorableMoon';
import { ZenithResult } from '../types/Zenith';

function getMoonIllumination(date: Date): number {
    const moonIllumination = SunCalc.getMoonIllumination(date);
    return moonIllumination.fraction * 100; // Convert to percentage
}

function isMoonVisible(coords: Coordinates, date: Date, timezone: string): boolean {
    const sunTimes = SunCalc.getTimes(date, coords.lat, coords.lon);
    const moonTimes = SunCalc.getMoonTimes(date, coords.lat, coords.lon);

    if (!moonTimes.rise || !moonTimes.set) {
        return false;
    }

    const sunset = moment.tz(sunTimes.sunset, timezone).toDate();
    const moonrise = moment.tz(moonTimes.rise, timezone).toDate();

    const moonriseMinutesBeforeSunset = (moonrise.getTime() - sunset.getTime()) / (1000 * 60);
    if (moonriseMinutesBeforeSunset < 0 && moonriseMinutesBeforeSunset > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

    return false;
}

function findMoonZenith(coords: Coordinates, date: Date, startTime: string, endTime: string, timezone: string): ZenithResult {
    const startMoment =  moment.tz(date, timezone).set({ hour: parseInt(startTime.split(':')[0]), minute: parseInt(startTime.split(':')[1]) });
    const endMoment =  moment.tz(date, timezone).set({ hour: parseInt(endTime.split(':')[0]), minute: parseInt(endTime.split(':')[1]) });

    // If end time is earlier than start time, add one day to end time
    if (endMoment.isBefore(startMoment)) {
        endMoment.add(1, 'day');
    }

    let highestAltitude = -Infinity;
    let zenithTime: Date = startMoment.toDate();

    const currentTime = startMoment.clone();

    while (currentTime.isSameOrBefore(endMoment)) {
        const moonPosition = SunCalc.getMoonPosition(currentTime.toDate(), coords.lat, coords.lon);
        if (moonPosition.altitude > highestAltitude) {
            highestAltitude = moonPosition.altitude;
            zenithTime = currentTime.toDate();
        }
        currentTime.add(1, 'minute'); // Adjust the interval as needed
    }

    const determinedZenithTime: ZenithResult = {
        time: zenithTime,
        altitude: highestAltitude
    }
    return determinedZenithTime
}

export function getFavorableMoonDatesInRange(coords: Coordinates, startDate: Date, endDate: Date, timezone: string, minIllumination: number = 80): FavorableMoon[] {
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
                    moonriseTime: SunCalc.getMoonTimes(currentDate.toDate(), coords.lat, coords.lon).rise,
                    moonsetTime: SunCalc.getMoonTimes(currentDate.toDate(), coords.lat, coords.lon).set,
                    sunsetTime: SunCalc.getTimes(currentDate.toDate(), coords.lat, coords.lon).sunset,
                };
                console.log(favorableMoon);

                const moonriseTimeHHMM = favorableMoon.moonriseTime.toTimeString().slice(0, 5);
                const moonsetTimeHHMM = favorableMoon.moonsetTime.toTimeString().slice(0, 5);
                // TODO: This is time consuming, consider optimizing
                favorableMoon.zenithTime = findMoonZenith(coords, currentDate.toDate(), moonriseTimeHHMM, moonsetTimeHHMM, timezone);
                
                dateRange.push(favorableMoon);
            }
        }
        currentDate.add(1, 'days');
    }

    return dateRange;
}
