import { getGeocoder } from "../../utils/date-utils";
import { parseLocation } from "../../utils/parse-location";

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  //return mockWeatherData();

  const { lat, long } = (await request.json()) as { lat: number; long: number };

  const geocoder = getGeocoder();

  const locations = await geocoder.reverse({
    lat,
    lon: long,
  });

  const location = parseLocation(locations, "Unknown");
  return new Response(
    JSON.stringify({
      location: location,
    })
  );
}
