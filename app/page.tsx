import { headers } from "next/headers";
import { DateTime } from "luxon";
import { checkHikingConditionsInRange, simpleMoonTimes } from "./utils/moon2";

export default async function Page() {
  const headersList = await headers();

  let latitude = headersList.get("x-vercel-ip-latitude");
  let longitude = headersList.get("x-vercel-ip-longitude");
  let city = headersList.get("x-vercel-ip-city");
  let region = headersList.get("x-vercel-ip-country-region");
  let timezone = headersList.get("x-vercel-ip-timezone");

  // Default
  if (!latitude || !longitude || !city || !region || !timezone) {
    latitude = "33.0893";
    longitude = "-117.1153";
    city = "Escondido";
    region = "CA";
    timezone = "America/Los_Angeles";
  }

  const conditions = {
    latitude: +latitude,
    longitude: +longitude,
    timezone: timezone,
    minIllumination: 80,
    startHikeTime: "20:00", // 8 PM
    endHikeTime: "23:00", // 11 PM
  };

  // Check a range of dates
  const startDate = DateTime.now().setZone("UTC");
  const endDate = DateTime.now().plus({ days: 45 }).setZone("UTC");

  const results = checkHikingConditionsInRange(startDate, endDate, conditions);
  const simple = simpleMoonTimes(endDate, conditions);

  // const favorableMoonDates = getFavorableMoonDatesInRange(
  //   coords,
  //   startDate,
  //   endDate,
  //   timezone as string
  // );

  return (
    <div>
      <h1 className="font-bold">Request Information</h1>
      <p>Lat: {latitude}</p>
      <p>Long: {longitude}</p>
      <p>City: {city}</p>
      <p>Region: {region}</p>
      <br />
      <p className="font-bold">Simple Moon Times {endDate.toISODate()}:</p>
      <ul>
        <li>
          Moon rise: {simple.rise ? simple.rise.toString() : "N/A"}
        </li>
        <li>Moon set: {simple.set ? simple.set.toString() : "N/A"}</li>
      </ul>
      <br />
      <p className="font-bold">Favorable Moon Dates:</p>
      <ul>
        {results.map((favorableMoon) => (
          <div key={favorableMoon.date.toString()}>
            <li>---------------------------------</li>
            <li>{favorableMoon.date.toFormat("MMMM dd yyyy")}</li>
            <li>
              Moon Illumination {Math.round(favorableMoon.moonIllumination)}%
            </li>
            <li>
              Moon rise time:{" "}
              {favorableMoon.moonrise
                ? favorableMoon.moonrise.toFormat("hh:mm a")
                : "N/A"}
            </li>
            <li>
              Moon set time:{" "}
              {favorableMoon.moonset
                ? favorableMoon.moonset.toFormat("hh:mm a")
                : "N/A"}
            </li>
            <li>
              Sunset time:{" "}
              {favorableMoon.sunset
                ? favorableMoon.sunset.toFormat("hh:mm a")
                : "N/A"}
            </li>
            <li>
              Zenith time:{" "}
              {favorableMoon.moonZenith
                ? favorableMoon.moonZenith.toFormat("hh:mm a")
                : "N/A"}
            </li>
            <li>
              Good for hiking: {favorableMoon.goodForHiking}{" "}
              {favorableMoon.reason}
            </li>
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
}
