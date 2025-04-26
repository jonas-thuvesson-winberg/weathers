import { DateTime } from "luxon";
import NodeGeocoder, { type Options } from "node-geocoder";
import { default as nodeFetch } from "node-fetch";

/***
 * SERVER ONLY - needs node-fetch
 */
export const getGeocoder = () => {
  const options: Options = {
    provider: "openstreetmap",
    // Optional depending on your needs
    // httpAdapter: 'https', // Default
    // formatter: null, // 'gpx', 'string', ...
    // Set custom headers to comply with OSM usage policy
    // @ts-ignore
    fetch: async function (url: globalThis.RequestInfo, init?: RequestInit) {
      const headers = {
        ...init?.headers,
        "User-Agent": "Weathers/0.1 (jonasthuvesson@gmail.com)",
      };

      // TODO: A bit hacky... maybe look into a better way
      return (await nodeFetch(url.toString(), {
        ...init,
        headers,
        body:
          init?.body instanceof ArrayBuffer
            ? Buffer.from(init.body)
            : (init?.body as any),
      })) as unknown as Response;
    },
  };

  return NodeGeocoder(options);
};

export const getTime = (dateString: string, timezone: string) => {
  const dt = getDateTimeLuxon(dateString, timezone);
  if (!dt) return "";
  return dt.toISOTime()?.split(":").slice(0, 2).join(":");
};

export const getDate = (dateString: string, timezone: string) => {
  const dt = getDateTimeLuxon(dateString, timezone);
  if (!dt) return "";
  return dt.toISODate();
};

export const getDateTimeLuxon = (dateString: string, timezone: string) => {
  if (!dateString || !timezone) return null;

  let cityTime: DateTime | null = null;
  cityTime = DateTime.fromJSDate(new Date(dateString)).setZone(timezone);

  return cityTime;
};

export const getDateDescriptive = (s: string) => {
  const d = new Date(s);
  return d.toDateString().split(" ").slice(0, 3).join(" ");
};

export const getDateTime = (s: string, timezone: string) =>
  `${getDate(s, timezone)}, ${getTime(s, timezone)}`;
export const getDateTimeDescriptive = (s: string, timezone: string) =>
  `${getDateDescriptive(s)}, ${getTime(s, timezone)}`;

export const isThePast = (s: string) => {
  const d = new Date(s);
  return d < new Date();
};

/**
 * Sorts an array of date strings in ascending order.
 * @param dates - An array of strings representing dates.
 * @returns A new array of date strings sorted by date and time.
 */
export function sortDates(dates: string[]): string[] {
  return dates
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

/**
 * Sorts an array of date strings in ascending order.
 * @param dates - An array of any complex objects containing date strings.
 * @param getDateString - A function that extracts the date string from an entry.
 * @returns A new array of date strings sorted by date and time.
 */
export const sortByDates = <T>(
  dates: T[],
  getDateString: (entry: T) => string
): T[] => {
  return dates
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort(
      (a, b) =>
        new Date(getDateString(a)).getTime() -
        new Date(getDateString(b)).getTime()
    );
};
