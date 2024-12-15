import { ZenithResult } from "./Zenith";

export interface FavorableMoon {
    date: Date;
    illuminationPercentage: number;
    moonriseTime: Date;
    moonsetTime: Date;
    sunsetTime: Date;
    zenithTime?: ZenithResult;
}