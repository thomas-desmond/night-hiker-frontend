import { DateTime } from "luxon";

export interface ZenithResult {
    time: DateTime;
    altitude: number;
}
