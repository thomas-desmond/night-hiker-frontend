import HikingDatesContainer from "@/components/hiking-dates-container";
import { LocationHeader } from "@/components/location-header";
import { headers } from 'next/headers'

export const dynamic = "force-dynamic";

export default async function Home() {
  const headersList = await headers()

  let latitude = headersList.get("x-vercel-ip-latitude") || "";
  let longitude = headersList.get("x-vercel-ip-longitude") || "";
  let city = headersList.get("x-vercel-ip-city") || "";
  let region = headersList.get("x-vercel-ip-country-region") || "";
  let timezone = headersList.get("x-vercel-ip-timezone") || "";

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <LocationHeader />
      <HikingDatesContainer 
        latitude={latitude} 
        longitude={longitude} 
        city={city} 
        region={region} 
        timezone={timezone} 
      />
    </div>
  );
}