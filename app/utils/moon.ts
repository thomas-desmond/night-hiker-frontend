import moment from 'moment';
import SunCalc from 'suncalc';
import { Coordinates } from '../types/Coordinates';

function getMoonIllumination(date: Date): number {
    const moonIllumination = SunCalc.getMoonIllumination(date);
    return moonIllumination.fraction * 100; // Convert to percentage
}

function isMoonVisible(coords: Coordinates, date: Date): boolean {
    const sunTimes = SunCalc.getTimes(date, coords.lat, coords.lon);
    const moonTimes = SunCalc.getMoonTimes(date, coords.lat, coords.lon);

    if (!moonTimes.rise || !moonTimes.set) {
        return false;
    }

    const sunset = moment(sunTimes.sunset).toDate();
    const moonrise = moment(moonTimes.rise).toDate();

    const moonriseMinutesBeforeSunset = (moonrise.getTime() - sunset.getTime()) / (1000 * 60);
    if (moonriseMinutesBeforeSunset < 0 && moonriseMinutesBeforeSunset > -400) return true; // moonrise is before sunset and no more than 400 minutes before sunset

    return false;
}

export function findMoonIlluminationDates(coords: Coordinates, startDate: Date, endDate: Date, minIllumination: number = 80): Date[] {
    let currentDate = moment(startDate);
    const endMoment = moment(endDate);
    const dateRange: Date[] = [];

    while (currentDate.isSameOrBefore(endMoment)) {
        const illumination = getMoonIllumination(currentDate.toDate());
        if (illumination >= minIllumination) {
            if (isMoonVisible(coords, currentDate.toDate())) {
                dateRange.push(currentDate.toDate());
            }
        }
        currentDate.add(1, 'days');
    }

    return dateRange;
}

// export default {
//     async fetch(request): Promise<Response> {
//         const coords: Coordinates = { lat: 33.1954333, lon: -116.3885842 };
//         const startDate = new Date(2025, 0, 1); // January 1, 2023
//         const endDate = new Date(2025, 0, 31); // December 31, 2023

//         const dates = findMoonIlluminationDates(coords, startDate, endDate);

//         // Print the results
//         console.log(`Moon visibility dates in 2025:`);
//         dates.forEach((date) => {
//             console.log(moment(date).format('YYYY-MM-DD'));
//         });
//         return new Response(JSON.stringify(dates));
//     },
// };
