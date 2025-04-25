import { TiRefresh } from "solid-icons/ti";
import { IoRefresh } from "solid-icons/io";
import { WiRefresh } from "solid-icons/wi";
import { IoRefreshCircle } from "solid-icons/io";

import type { WeatherData } from "../pages/api/weather";
import { getDateTimeDescriptive } from "../utils/date-utils";
import { navigate } from "astro:transitions/client";

export const MainWeatherDisplay = ({
  weatherData: {
    location,
    current: {
      time,
      temperature,
      weatherCode,
      windSpeed,
      windDirection,
      precipitation,
    },
  },
}: {
  weatherData: WeatherData;
}) => {
  const { description: weatherDescription, symbol: weatherSymbol } =
    weatherCode;
  const toTitleCase = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  const refresh = () => {
    console.log("Refreshing weather data...");
    // Refresh the current page while preserving query parameters
    navigate(`${window.location.pathname}${window.location.search}`, {
      replace: true,
    } as any);
    // window.location.reload();
  };

  return (
    <div class="flex justify-center">
      <div class="flex w-full max-w-2xl xl:max-w-3xl flex-col items-center rounded-xl bg-sky-200 text-white text-shadow-sky-300 text-shadow-lg">
        <div class="font-xl p-5 w-full flex flex-row justify-end">
          <IoRefreshCircle
            size="3rem"
            class="hover:cursor-pointer"
            onClick={() => refresh()}
          />
        </div>
        <div class="py-7 w-full xl:w-2xl weather-entry flex flex-col ">
          <div class="flex flex-col items-center justify-center break-all xs:break-normal text-center ">
            <h3 class="text-5xl font-bold">{toTitleCase(location)}</h3>
            <div class="flex gap-4 flex-row mb-2 mx-10">
              <h3 class="text-5xl font-bold">{temperature.toFixed(1)}°</h3>
              <div class="text-5xl weather-symbol">{weatherSymbol}</div>
            </div>
            {/* <div class="text-xl mb-3 mx-10">{weatherDescription}</div> */}
            <div class="text-xl mx-10">
              Wind: <span class="">{windSpeed.toFixed(2)} m/s</span>,{" "}
              <span class="">{Math.round(windDirection)}°</span>
            </div>
            {precipitation !== undefined && (
              <div class="text-xl mx-10">
                Precip: {precipitation.toFixed(2)} mm
              </div>
            )}
            <div class="text-xl mx-10">{getDateTimeDescriptive(time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
