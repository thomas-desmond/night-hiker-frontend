import { headers } from "next/headers";
import { getFavorableMoonDatesInRange } from "./utils/moon";
import { Coordinates } from "./types/Coordinates";

export default async function Page() {
  const headersList = await headers();

  let latitude = headersList.get("x-vercel-ip-latitude");
  let longitude = headersList.get("x-vercel-ip-longitude");
  let city = headersList.get("x-vercel-ip-city");
  let region = headersList.get("x-vercel-ip-country-region");

  if (!latitude || !longitude || !city || !region) {
    latitude = "33.1954333";
    longitude = "-116.3885842";
    city = "Borrego Springs";
    region = "CA";
  }

  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 0, 31); // January 31, 2025

  const coords: Coordinates = {
    lat: parseFloat(latitude as string),
    lon: parseFloat(longitude),
  };
  const favorableMoonDates = getFavorableMoonDatesInRange(coords, startDate, endDate);

  return (
    <div>
      <h1 className="font-bold">Request Information</h1>
      <p>Lat: {latitude}</p>
      <p>Long: {longitude}</p>
      <p>City: {city}</p>
      <p>Region: {region}</p>
      <br />
      <p className="font-bold">Favorable Moon Dates:</p>
      <ul>
        {favorableMoonDates.map((favorableMoon) => (
          <div key={favorableMoon.date.toDateString()}>
            <li>{favorableMoon.date.toDateString()}</li>
            <li>Moon Illumination {Math.round(favorableMoon.illuminationPercentage)}%</li>
            <li>Moon rise time: {favorableMoon.moonriseTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</li>
            <li>Sunset time:{favorableMoon.sunsetTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</li>
            <li>Zenith time:{favorableMoon.zenithTime?.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</li>
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
}
