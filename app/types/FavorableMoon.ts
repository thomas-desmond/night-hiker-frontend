import { DateTime } from "luxon";
import { ZenithResult } from "./Zenith";

export interface FavorableMoon {
    date: Date;
    illuminationPercentage: number;
    moonriseTime: DateTime;
    moonsetTime: DateTime;
    sunsetTime: DateTime;
    zenithTime?: ZenithResult;
}