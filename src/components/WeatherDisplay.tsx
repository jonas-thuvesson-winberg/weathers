import { createEffect, createMemo, createSignal, For } from "solid-js";
import type { WeatherData } from "../pages/api/weather";

export const WeatherDisplay = (props: { weatherData: WeatherData }) => {
  const [data, setData] = createSignal(props);
  const weatherTableData = createMemo(() => {
    const {
      weatherData: {
        hourly: { temperature, timeAdjusted, weatherCode, precipitation, rain },
      },
    } = data();

    const temperatureArr = Object.values(temperature);
    console.log("Temperature array:", JSON.stringify(temperatureArr));
    console.log("Time adjusted array:", JSON.stringify(timeAdjusted));
    console.log("Weather code array:", JSON.stringify(weatherCode));

    let out: any[] = [];
    console.log(temperatureArr.length);
    console.log(timeAdjusted.length);
    console.log(weatherCode.length);
    for (let i = 0; i < temperatureArr.length; i++) {
      //   console.log(
      //     "here",
      //     i,
      //     temperatureArr[i],
      //     timeAdjusted[i],
      //     weatherCode[i]
      //   );

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
        new Date(timeAdjusted[i]),
        Math.floor(Number(temperatureArr[i])),
        precipitation[i],
        rain[i],
        description,
        symbol,
      ]);
    }
    console.log("Weather table data:", JSON.stringify(out));
    return out;
  });

  createEffect(() => {
    // console.log(
    //   "Weather data updated:",
    //   JSON.stringify(data().weatherData.hourly)
    // );
  });

  const tHeadCell = (d: string) => {
    return <th class="px-4 py-2">{d}</th>;
  };
  const tBodyCell = (d: any, additionalClasses: string) => {
    return (
      <td class={`max-w-2xl px-4 py-2 ${additionalClasses}`}>{d.toString()}</td>
    );
  };

  return (
    <table class="m-6">
      <thead>
        <tr>
          {tHeadCell("Time")}
          {tHeadCell("Temperature")}
          {tHeadCell("Precipitation")}
          {tHeadCell("Rain")}
          {tHeadCell("Description")}
          {tHeadCell("Symbol")}
        </tr>
      </thead>
      <tbody>
        <For each={weatherTableData()}>
          {(item) => (
            <tr>
              {tBodyCell(item[0], "border-r-1 border-gray-400")}
              {tBodyCell(item[1], "border-r-1 border-gray-400")}
              {tBodyCell(item[2], "border-r-1 border-gray-400")}
              {tBodyCell(item[3], "border-r-1 border-gray-400")}
              {tBodyCell(item[4], "border-r-1 border-gray-400")}
              {tBodyCell(item[5], "text-4xl")}
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};
