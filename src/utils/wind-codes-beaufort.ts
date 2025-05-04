// beaufort-scale.ts

type BeaufortScale = {
  [category: string]: [number, number];
};

// Values are in km/h
export const beaufortScale: BeaufortScale = {
  Calm: [0, 1.8], // 0–1 mph
  "Light air": [1.9, 5.7], // 1–3 mph
  "Light breeze": [5.8, 11.3], // 4–7 mph
  "Gentle breeze": [11.4, 19.6], // 8–12 mph
  "Moderate breeze": [19.7, 28.1], // 13–17 mph
  "Fresh breeze": [28.2, 38.5], // 18–24 mph
  "Strong breeze": [38.6, 49.8], // 25–31 mph
  "Near gale": [49.9, 61.2], // 32–38 mph
  Gale: [61.3, 74.0], // 39–46 mph
  "Strong gale": [74.1, 88.5], // 47–54 mph
  Storm: [88.6, 102.9], // 55–63 mph
  "Violent storm": [103.0, 117.4], // 64–72 mph
  Hurricane: [117.5, Infinity], // ≥73 mph
};

export const beufortIntervals = Object.values(beaufortScale);
export const beaufortCategories = Object.keys(beaufortScale);

// speed in m/s
export const getCategoryBySpeed = (speed: number): string => {
  const asKmH = speed * 3.6; // Convert m/s to km/h
  return (
    Object.entries(beaufortScale).find(([_, [min, max]]) => {
      return asKmH >= min && asKmH <= max;
    })?.[0] || ""
  );
};
