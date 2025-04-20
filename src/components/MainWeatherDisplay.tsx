import type { WeatherData } from "../pages/api/weather";
import { getDateTimeDescriptive } from "../utils/date-utils";

export const MainWeatherDisplay = ({
  weatherData: {
    current: {
      time,
      temperature,
      weatherCode: { symbol: weatherSymbol, description: weatherDescription },
      windSpeed,
      windDirection,
    },
  },
}: {
  weatherData: WeatherData;
}) => {
  console.log("Time: ", time);

  return (
    <div class="flex justify-center">
      <div class="flex  w-full max-w-2xl xl:max-w-3xl flex-col items-center rounded-xl bg-sky-200">
        <div class="py-7 w-full xl:w-2xl weather-entry flex flex-col ">
          <div class="flex flex-col items-center">
            <div class="flex gap-4 flex-row mb-2">
              <h3 class="text-5xl font-bold">{Math.round(temperature)}°C</h3>
              <div class="text-5xl weather-symbol">{weatherSymbol}</div>
            </div>
            <div class="text-xl mb-3">{weatherDescription}</div>
            <div class="text-xl font-semibold">
              Wind: {Math.round(windSpeed)} m/s, {Math.round(windDirection)}°
            </div>
            <div class="text-xl font-semibold">
              {getDateTimeDescriptive(time)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
