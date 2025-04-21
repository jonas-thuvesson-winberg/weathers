import { createMemo, createSignal, For } from "solid-js";
import type { WeatherData } from "../pages/api/weather";
import { WeatherEntry } from "./WeatherEntry";
import { sortByDates } from "../utils/date-utils";
import { WeatherEntrySkeleton } from "./WeatherEntrySkeleton";

export const WeatherDisplaySkeleton = () => {
  const weatherTableData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div class="flex flex-col pt-5">
      <For each={weatherTableData}>{() => <WeatherEntrySkeleton />}</For>
    </div>
  );
};
