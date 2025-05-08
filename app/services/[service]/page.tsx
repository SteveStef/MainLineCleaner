// app/services/[service]/page.tsx
import ServiceClient from "./ServiceClient"
import { serviceInfo, serviceInfoES } from "./serviceInfo"  // or wherever you define your slugs

export const runtime = "edge";
/**
 * Tell Next.js which [service] pages to build.
 * Here we derive slugs from your serviceInfo keys.
 */
export async function generateStaticParams() {
  // assuming your serviceInfo keys are UPPERCASE service names:
  const slugs = Object.keys(serviceInfo).map((key) => key.toLowerCase())
  return slugs.map((service) => ({ service }))
}

/**
 * This is now a server component. It just renders the client shell.
 */
export default function Page({ params }: { params: { service: string } }) {
  // you could even fetch data here if needed,
  // but in your case ServiceClient will pull from the context.
  return <ServiceClient />
}
