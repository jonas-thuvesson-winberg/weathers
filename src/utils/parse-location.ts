import NodeGeocoder from "node-geocoder";

export const parseLocation = (
  locations: NodeGeocoder.Entry[],
  cityFallback: string
) => {
  const locationPart = (l: string | null | undefined, fallback?: string) =>
    l || fallback ? (l || fallback) + ", " : "";

  const res = (
    locationPart(locations[0].city, cityFallback) +
    locationPart(locations[0].district) +
    locationPart(locations[0].state) +
    locationPart(locations[0].country)
  ).trim();

  if (res.endsWith(",")) {
    return res.slice(0, -1);
  }
  return res;
};
