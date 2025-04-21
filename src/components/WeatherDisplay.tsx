import { createMemo, createSignal, For } from "solid-js";
import type { WeatherData } from "../pages/api/weather";
import { WeatherEntry } from "./WeatherEntry";
import { sortByDates } from "../utils/date-utils";

export const WeatherDisplay = (props: { weatherData: WeatherData }) => {
  const [data, setData] = createSignal(props);
  const weatherTableData = createMemo(() => {
    const {
      weatherData: {
        hourly: { temperature, time, weatherCode, precipitation, rain },
      },
    } = data();

    let out: [string, number, number, string][] = [];

    // Is supposed to be array, but API I'm using is stupid
    const tempLength = Array.isArray(temperature)
      ? temperature.length
      : Object.values(temperature).length;

    for (let i = 0; i < tempLength; i++) {
      console.log("here", i);

      let { description, symbol } = weatherCode[i];

      let current = i;
      while (
        weatherCode?.[current]?.description ===
        "State of sky on the whole unchanged"
      ) {
        if (current > 0) {
          symbol = weatherCode[--current].symbol;
        } else {
          description = "Unknown";
          symbol = "❓";
          break;
        }
      }
      out.push([
        new Date(time[i]).toString(),
        Math.floor(Number(temperature[i])),
        precipitation[i],
        symbol,
      ]);
    }
    console.log("Weather table data:", JSON.stringify(out));
    return sortByDates(out, (x) => x[0]);
  });

  return (
    <div class="flex flex-col pt-5">
      <For each={weatherTableData()}>
        {(item) => (
          <WeatherEntry
            time={item[0]}
            temperature={item[1]}
            precipitation={item[2]}
            symbol={item[3]}
          />
        )}
      </For>
    </div>
  );
};
