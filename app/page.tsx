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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <LocationHeader />
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <HikingDatesContainer 
              latitude={latitude} 
              longitude={longitude} 
              city={city} 
              region={region} 
              timezone={timezone} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}