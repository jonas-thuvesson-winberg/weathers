export const prerender = false;

import {
  getUsableWeatherCode,
  normalizeWeatherCodes,
  wmo4677WithSymbols,
} from "../../utils/weather-codes";
import { fetchWeatherApi } from "openmeteo";
import { WeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import { mockWeatherData as mockData } from "../../utils/mock-weather-data";
import * as fs from "node:fs";
import NodeGeocoder, { type Options } from "node-geocoder";
import { getGeocoder } from "../../utils/date-utils";
import tzLookup from "tz-lookup";
import { weatherCodeMapSmhi } from "../../utils/weather-codes-smhi";

export interface WeatherData {
  location: string;
  timezone: string;
  current: {
    time: string;
    temperature: number;
    weatherCode: { description: string; symbol: string };
    windSpeed: number;
    windDirection: number;
    precipitation?: number;
    // timeAdjusted?: string | null;
  };
  hourly: {
    time: string[];
    weatherCodes: { description: string; symbol: string }[];
    temperature: number[];
    precipitation: number[];
    // timeAdjusted?: string[];
  };
  daily?: {
    time: string[];
    weatherCodes: { description: string; symbol: string }[];
    // timeAdjusted?: string[];
    temperatureMax?: number[];
    temperatureMin?: number[];
  };
}

interface SmhiGeometry {
  type: string;
  coordinates: number[][][];
}

interface SmhiParameter {
  name: string;
  levelType: string;
  level: number;
  unit: string;
  values: number[];
}

interface SmhiTimeSeriesEntry {
  validTime: string;
  parameters: SmhiParameter[];
}

interface SmhiForecastResponse {
  approvedTime: string;
  referenceTime: string;
  geometry: SmhiGeometry;
  timeSeries: SmhiTimeSeriesEntry[];
}

const parseLocation = (
  locations: NodeGeocoder.Entry[],
  cityFallback: string
) => {
  const locationPart = (l: string | null | undefined, fallback?: string) =>
    l || fallback ? (l || fallback) + ", " : "";

  return (
    locationPart(locations[0].city, cityFallback) +
    locationPart(locations[0].district) +
    locationPart(locations[0].state) +
    locationPart(locations[0].country)
  );
};

const mapResponsesOpenMeteo = async (
  responses: WeatherApiResponse[],
  geocoder: NodeGeocoder.Geocoder,
  location: string = "Stockholm"
) => {
  // Helper function to form time ranges
  const toDateRange = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const adjustTime = (t: number, utcOffsetSeconds: number) =>
    new Date((t + utcOffsetSeconds) * 1000);

  const toWeatherDescription = (
    code: number
  ): { description: string; symbol: string } => {
    return wmo4677WithSymbols[Number(code)];
  };

  const response = responses![0];

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const timezone = tzLookup(latitude, longitude);
  const locations = await geocoder.reverse({ lat: latitude, lon: longitude });

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData: WeatherData = {
    // TODO: Make location dynamic
    location: parseLocation(locations, location),
    timezone,
    current: {
      time: new Date(
        adjustTime(Number(current.time()), utcOffsetSeconds)
      ).toISOString(),
      // timeAdjusted: null as string | null,
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
    weatherData.hourly!.weatherCodes,
    weatherData.hourly!.time
  );

  // fs.writeFileSync(
  //   `./src/pages/api/_backup_${new Date().toISOString()}.json`,
  //   JSON.stringify(weatherData)
  // );

  return new Response(JSON.stringify(weatherData));
};

const getWeatherDataOpenMeteo = async (location: string = "Stockholm") => {
  const geocoder = getGeocoder();
  const r = await geocoder.geocode(location);

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
  return mapResponsesOpenMeteo(response, geocoder, location);
};

const getWeatherDataSmhi = async (
  location: string = "Stockholm"
): Promise<Response> => {
  const geocoder = getGeocoder();
  const r = await geocoder.geocode(location);
  const latitude = r[0].latitude!.toFixed(4);
  const longitude = r[0].longitude!.toFixed(4);

  const locations = await geocoder.reverse({
    lat: Number(latitude),
    lon: Number(longitude),
  });

  if (locations?.[0]?.country?.toLowerCase().trim() !== "sverige")
    return getWeatherDataOpenMeteo(location);

  const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
  console.log(url);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        console.error("Network response was not ok");
      }

      const json = response.json();
      return json; // Updated to return the parsed JSON instead of response.json()
    })
    .then(async (data: SmhiForecastResponse) => {
      const timezone = tzLookup(Number(latitude), Number(longitude));
      // const locations = await geocoder.reverse({
      //   lat: Number(latitude),
      //   lon: Number(longitude),
      // });

      const res: WeatherData = {
        location: parseLocation(locations, location),
        timezone,
        current: {
          time: new Date(data.timeSeries[0].validTime).toISOString(),
          temperature: data.timeSeries[0].parameters.find(
            (parameter) => parameter.name === "t"
          )!.values[0],
          weatherCode:
            weatherCodeMapSmhi[
              data.timeSeries[0].parameters.find(
                (parameter) => parameter.name === "Wsymb2"
              )!.values[0]
            ],
          windSpeed: data.timeSeries[0].parameters.find(
            (parameter) => parameter.name === "ws"
          )!.values[0],
          windDirection: data.timeSeries[0].parameters.find(
            (parameter) => parameter.name === "wd"
          )!.values[0],
          precipitation: data.timeSeries[0].parameters.find(
            (parameter) => parameter.name === "pmean"
          )!.values[0],
        },
        hourly: {
          time: data.timeSeries
            .slice(1)
            .map((entry) => new Date(entry.validTime).toISOString()),
          weatherCodes: data.timeSeries
            .slice(1)
            .map(
              (entry) =>
                weatherCodeMapSmhi[
                  entry.parameters.find(
                    (parameter) => parameter.name === "Wsymb2"
                  )!.values[0]
                ]
            ),
          temperature: data.timeSeries
            .slice(1)
            .map(
              (entry) =>
                entry.parameters.find((parameter) => parameter.name === "t")!
                  .values[0]
            ),
          precipitation: data.timeSeries
            .slice(1)
            .map(
              (entry) =>
                entry.parameters.find(
                  (parameter) => parameter.name === "pmean"
                )!.values[0]
            ),
        },
      };

      // fs.writeFileSync(
      //   `./src/pages/api/smhi_${new Date().toISOString()}.json`,
      //   JSON.stringify(data),
      //   "utf8"
      // );
      return new Response(JSON.stringify(res));
    });

  // return smhi.Forecasts.GetPointForecast(latitude, longitude).on(
  //   "loaded",
  //   (data: SmhiForecastResponse) => {
  //     // console.log("Forecast data:", JSON.stringify(data));
  //     // return new Response(JSON.stringify(data));

  //     data.timeSeries.forEach((entry) => {
  //       console.log(entry.validTime);

  //       entry.parameters.forEach((param) => {
  //         console.log(param.name, param.values);
  //       });
  //     });
  //   }
  // );
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
    timezone: "Europe/Stockholm",
    current: {
      time: new Date().toISOString(),
      // timeAdjusted: null,
      temperature: 10,
      weatherCode: { description: "Clear", symbol: "☀️" },
      windSpeed: 5,
      windDirection: 180,
    },
    hourly: {
      time: [new Date().toISOString(), new Date().toISOString()],
      // timeAdjusted: ["2025-04-19T19:43:04+02:00", "2025-04-20T21:00:04+02:00"],
      weatherCodes: [
        { description: "Clear", symbol: "☀️" },
        { description: "Partly cloudy", symbol: "🌤️" },
      ],
      temperature: [10, 12],
      precipitation: [10, 0],
    },
    daily: {
      time: [new Date().toISOString(), new Date().toISOString()],
      // timeAdjusted: ["2025-04-19T19:43:04+02:00", "2025-04-20T21:00:04+02:00"],
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
  return getWeatherDataSmhi(location || "Stockholm");
}
