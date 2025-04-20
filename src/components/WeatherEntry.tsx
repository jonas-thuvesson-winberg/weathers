import { FaSolidChevronDown, FaSolidChevronUp } from "solid-icons/fa";
import { createMemo, createSignal } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { ChevronToggle } from "./ChevronToggle";
import {
  getDateDescriptive,
  getDateTimeDescriptive,
  getTime,
} from "../utils/date-utils";

export const WeatherEntry = (props: {
  time: string;
  temperature: number;
  precipitation: number;
  symbol: string;
}) => {
  const { time, temperature, precipitation, symbol } = props;

  const [open, setOpen] = createSignal(true);

  const handleClick = () => {
    setOpen(!open());
  };

  const chevronContainerClasses = createMemo(() => {
    return open()
      ? "flex justify-end pr-2 pb-2 border-b-1 border-gray-300"
      : "flex justify-end pr-2 pb-2 border-b-1 border-white";
  });

  const containerClasses =
    "py-7 w-full max-w-2xl xl:max-w-3xl weather-entry flex flex-wrap flex-col border-b-1 border-gray-300";

  return (
    <div class="flex flex-col w-full items-center">
      <div class={`${containerClasses}`}>
        <div class={`${chevronContainerClasses()}`}>
          <ChevronToggle
            handleClick={handleClick}
            initialOpen={open()}
            duration={0.5}
          />
        </div>
        <Presence>
          {open() && (
            <Motion.div
              initial={{
                transform: "translateY(-20px)",
                opacity: 0,
              }}
              animate={{
                transform: "translateY(0px)",
                opacity: 1,
              }}
              transition={{
                opacity: { duration: 1 },
                transform: { duration: 0.5 },
              }}
              exit={{
                opacity: 0,
                transform: "translateY(-20px)",
                transition: {
                  transform: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                },
              }}
              class="flex flex-row items-start justify-between w-full h-full p-2 pt-4"
            >
              <div>
                <div class="text-lg weather-time">{getTime(time)}</div>
                <div class="weather-date">{getDateDescriptive(time)}</div>
                <div class="weather-temperature">{temperature}°C</div>
                <div class="weather-precipitation">{precipitation} mm</div>
                {/* <div class="weather-description">{description}</div> */}
              </div>
              <div class="text-3xl weather-symbol">{symbol}</div>
            </Motion.div>
          )}
        </Presence>
      </div>
    </div>
  );
};
