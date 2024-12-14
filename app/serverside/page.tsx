import { headers } from 'next/headers'

export default async function Page() {
    const headersList = await headers()

    const userAgent = headersList.get('user-agent')
    const ip = headersList.get('x-real-ip')
  return (
    <div>
      <h1>Request Information</h1>
      <p>User Agent: {userAgent}</p>
      <p>ip: {ip}</p>
    </div>
  )
}