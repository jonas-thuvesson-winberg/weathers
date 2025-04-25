// // @ts-nocheck
import {
  getUsableWeatherCode,
  normalizeWeatherCodes,
  wmo4677WithSymbols,
} from "../../utils/weather-codes";
import { fetchWeatherApi } from "openmeteo";
import { WeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import { DateTime } from "luxon";
import { mockWeatherData as mockData } from "../../utils/mock-weather-data";
import * as fs from "node:fs";
import NodeGeocoder, { type Options } from "node-geocoder";
import { default as nodeFetch } from "node-fetch";

export interface WeatherData {
  location: string;
  current: {
    time: string;
    temperature: number;
    weatherCode: { description: string; symbol: string };
    windSpeed: number;
    windDirection: number;
    precipitation?: number;
    timeAdjusted?: string | null;
  };
  hourly: {
    time: string[];
    weatherCodes: { description: string; symbol: string }[];
    temperature: number[];
    precipitation: number[];
    timeAdjusted?: string[];
  };
  daily: {
    time: string[];
    weatherCodes: { description: string; symbol: string }[];
    timeAdjusted?: string[];
    temperatureMax?: number[];
    temperatureMin?: number[];
  };
}

// Helper function to form time ranges
const toDateRange = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const adjustTime = (t: number, utcOffsetSeconds: number) =>
  new Date((t + utcOffsetSeconds) * 1000);

const toGmt = (d: Date) => {
  const utcDateTime = DateTime.fromISO(d.toISOString(), { zone: "utc" });
  const gmtZone = utcDateTime.setZone("Europe/Stockholm");

  return gmtZone.toFormat("yyyy-MM-dd HH:mm:ssZZ");
};

const toWeatherDescription = (
  code: number
): { description: string; symbol: string } => {
  return wmo4677WithSymbols[Number(code)];
};

const mapResponses = async (
  responses: WeatherApiResponse[],
  geocoder: NodeGeocoder.Geocoder
) => {
  const response = responses![0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();
  const r = await geocoder.reverse({ lat: latitude, lon: longitude });

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData: WeatherData = {
    // TODO: Make location dynamic
    location: r[0].city!,
    current: {
      time: new Date(
        adjustTime(Number(current.time()), utcOffsetSeconds)
      ).toISOString(),
      timeAdjusted: null as string | null,
      temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
      weatherCode: toWeatherDescription(current.variables(1)!.value()),
      precipitation: current.variables(2)!.value(),
      windSpeed: current.variables(3)!.value(),
      windDirection: current.variables(4)!.value(),
    },
    hourly: {
      time: toDateRange(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => adjustTime(t, utcOffsetSeconds).toISOString()),
      weatherCodes: normalizeWeatherCodes(
        Array.from(hourly.variables(1)!.valuesArray()!).map((n) =>
          toWeatherDescription(n)
        )
      ),
      temperature: Array.from(hourly.variables(0)!.valuesArray()!), // `.valuesArray()` get an array of floats
      precipitation: Array.from(hourly.variables(2)!.valuesArray()!),
    },
    daily: {
      time: toDateRange(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => adjustTime(t, utcOffsetSeconds).toISOString()),
      weatherCodes: normalizeWeatherCodes(
        Array.from(daily.variables(0)!.valuesArray()!).map(toWeatherDescription)
      ),
      temperatureMax: Array.from(daily.variables(1)!.valuesArray()!),
      temperatureMin: Array.from(daily.variables(2)!.valuesArray()!),
    },
  };

  weatherData.current.weatherCode = getUsableWeatherCode(
    weatherData.current.weatherCode,
    weatherData.current.time,
    weatherData.hourly.weatherCodes,
    weatherData.hourly.time
  );

  // fs.writeFileSync(
  //   `./src/pages/api/_backup_${new Date().toISOString()}.json`,
  //   JSON.stringify(weatherData)
  // );

  return new Response(JSON.stringify(weatherData));
};

const getWeatherData = async (location: string | null) => {
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

  const geocoder = NodeGeocoder(options);
  const r = await geocoder.geocode(location || "Stockholm");

  const params = {
    latitude: r[0].latitude,
    longitude: r[0].longitude,
    current:
      "temperature_2m,weather_code,precipitation,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,weather_code,precipitation,",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const response = await fetchWeatherApi(url, params);
  return mapResponses(response, geocoder);
};

const mockWeatherData = () => {
  // const weatherData = fs.readFileSync(
  //   "./src/pages/api/_backup_2025-04-19T19:43:04.877Z.json",
  //   "utf8"
  // );
  return new Response(JSON.stringify(mockData));
};

const mockWeatherData2 = () => {
  const weatherData: WeatherData = {
    location: "Stockholm",
    current: {
      time: new Date().toISOString(),
      timeAdjusted: null,
      temperature: 10,
      weatherCode: { description: "Clear", symbol: "☀️" },
      windSpeed: 5,
      windDirection: 180,
    },
    hourly: {
      time: [new Date().toISOString(), new Date().toISOString()],
      timeAdjusted: ["2025-04-19T19:43:04+02:00", "2025-04-20T21:00:04+02:00"],
      weatherCodes: [
        { description: "Clear", symbol: "☀️" },
        { description: "Partly cloudy", symbol: "🌤️" },
      ],
      temperature: [10, 12],
      precipitation: [10, 0],
    },
    daily: {
      time: [new Date().toISOString(), new Date().toISOString()],
      timeAdjusted: ["2025-04-19T19:43:04+02:00", "2025-04-20T21:00:04+02:00"],
      weatherCodes: [
        { description: "Clear", symbol: "☀️" },
        { description: "Partly cloudy", symbol: "🌤️" },
      ],
      temperatureMax: [15, 18],
      temperatureMin: [5, 7],
    },
  };
  return new Response(JSON.stringify(weatherData));
};

// 59.3327° N, 18.0656° E
export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const location = searchParams.get("location");
  //return mockWeatherData();
  return getWeatherData(location);
}
