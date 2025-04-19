// // @ts-nocheck
import { wmo4677WithSymbols } from "../../utils/weather-codes";
import { fetchWeatherApi } from "openmeteo";
import { WeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import { DateTime } from "luxon";
import * as fs from "node:fs";

// Helper function to form time ranges
const toDateRange = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const adjustTime = (t: number, utcOffsetSeconds: number) =>
  new Date((t + utcOffsetSeconds) * 1000);

const toGmt = (d: Date) => {
  const utcDateTime = DateTime.fromISO(d.toISOString(), { zone: "utc" });
  const gmtZone = utcDateTime.setZone("Europe/Stockholm");

  return gmtZone.toFormat("yyyy-MM-dd HH:mm:ssZZ");
  //   return gmtZone.toJSDate();
};

const toWeatherDescription = (
  code: number
): { description: string; symbol: string } => {
  return wmo4677WithSymbols[code];
};

const mapResponses = (responses: WeatherApiResponse[]) => {
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date(adjustTime(Number(current.time()), utcOffsetSeconds)),
      timeAdjusted: null as string | null,
      temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
      weatherCode: toWeatherDescription(current.variables(1)!.value()),
      windSpeed: current.variables(2)!.value(),
      windDirection: current.variables(3)!.value(),
    },
    hourly: {
      time: toDateRange(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => adjustTime(t, utcOffsetSeconds)),
      timeAdjusted: [] as string[],
      weatherCode: Array.from(daily.variables(0)!.valuesArray()!).map(
        toWeatherDescription
      ),
      temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of floats
      precipitation: hourly.variables(1)!.valuesArray()!,
    },
    daily: {
      time: toDateRange(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => adjustTime(t, utcOffsetSeconds)),
      timeAdjusted: [] as string[],
      weatherCode: Array.from(daily.variables(0)!.valuesArray()!).map(
        toWeatherDescription
      ),
      temperatureMax: daily.variables(1)!.valuesArray()!,
      temperatureMin: daily.variables(2)!.valuesArray()!,
    },
  };

  // .map((n) => toWeatherDescription(n)) as string[],
  weatherData.hourly.timeAdjusted = weatherData.hourly.time.map(toGmt);
  weatherData.daily.timeAdjusted = weatherData.daily.time.map(toGmt);
  weatherData.current.timeAdjusted = toGmt(weatherData.current.time);

  //   fs.writeFile("./test.json", JSON.stringify(weatherData), (err) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       // file written successfully
  //     }
  //   });

  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  //   for (let i = 0; i < weatherData.hourly.time.length; i++) {
  //     // console.log(
  //     //   weatherData.hourly.time[i].toISOString(),
  //     //   weatherData.hourly.temperature2m[i]
  //     // );
  //   }

  return new Response(JSON.stringify(weatherData));
};

// 59.3327° N, 18.0656° E
export async function GET() {
  const params = {
    latitude: 52.52,
    longitude: 13.41,
    current: "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  //   let responses = null;
  //   const res = fs.readFileSync("./src/pages/api/_raw_backup.json", "utf8");
  //   responses = JSON.parse(res);
  return mapResponses(responses);
}
