export const getTime = (s: string) => {
  const d = new Date(s);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  };
  return d.toLocaleTimeString("sv-SE", options);
};

export const getDate = (s: string) => {
  const d = new Date(s);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Stockholm",
  };
  return d.toLocaleDateString("sv-SE", options);
};

export const getDateDescriptive = (s: string) => {
  const d = new Date(s);
  return d.toDateString().split(" ").slice(0, 3).join(" ");
};

export const getDateTime = (s: string) => `${getDate(s)}, ${getTime(s)}`;
export const getDateTimeDescriptive = (s: string) =>
  `${getDateDescriptive(s)}, ${getTime(s)}`;

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