import { createMemo, createSignal, For } from "solid-js";
import type { WeatherData } from "../pages/api/weather";
import { WeatherEntry } from "./WeatherEntry";
import { isThePast, sortByDates } from "../utils/date-utils";
import { normalizeWeatherCodes } from "../utils/weather-codes";

export const WeatherDisplay = (props: { weatherData: WeatherData }) => {
  const [data, setData] = createSignal(props);
  const weatherTableData = createMemo(() => {
    let {
      weatherData: {
        hourly: { temperature, time, weatherCode, precipitation },
      },
    } = data();

    let out: [string, number, number, string, string][] = [];

    weatherCode = normalizeWeatherCodes(weatherCode);
    // Is supposed to be array, but API I'm using is stupid
    const tempLength = Array.isArray(temperature)
      ? temperature.length
      : Object.values(temperature).length;

    for (let i = 0; i < tempLength; i++) {
      let { description, symbol } = weatherCode[i];

      out.push([
        new Date(time[i]).toString(),
        Math.floor(Number(temperature[i])),
        precipitation[i],
        description,
        symbol,
      ]);
    }
    return sortByDates(out, (x) => x[0]).filter(([d]) => !isThePast(d));
  });

  return (
    <div class="flex flex-col pt-5">
      <For each={weatherTableData()}>
        {(item) => (
          <WeatherEntry
            time={item[0]}
            temperature={item[1]}
            precipitation={item[2]}
            description={item[3]}
            symbol={item[4]}
          />
        )}
      </For>
    </div>
  );
};
