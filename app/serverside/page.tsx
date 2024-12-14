import { headers } from "next/headers";
import geoip from "geoip-lite";

export default async function Page() {
  const headersList = await headers();

  const userAgent = headersList.get("user-agent");
  const ip = headersList.get("x-real-ip");

//   if (!ip) {
//     return <div>IP Address not found</div>;
//   }
//   const location = geoip.lookup(ip);

  return (
    <div>
      <h1>Request Information</h1>
      <p>User Agent: {userAgent}</p>
      <p>IP: {ip}</p>
      <div>
        {Array.from(headersList).map(([name, value]) => (
          <p key={name}>
            {name}: {value}
          </p>
        ))}
      </div>
    </div>
  );
}
