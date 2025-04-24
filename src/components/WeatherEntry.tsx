import { createMemo, createSignal } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { ChevronToggle } from "./ChevronToggle";
import { getDateDescriptive, getTime } from "../utils/date-utils";

export const WeatherEntry = (props: {
  time: string;
  temperature: number;
  precipitation: number;
  description: string;
  symbol: string;
}) => {
  const { time, temperature, precipitation, symbol, description } = props;

  const [open, setOpen] = createSignal(true);

  const handleClick = () => {
    setOpen(!open());
  };

  const chevronContainerClasses = createMemo(() => {
    return open() ? "border-gray-300" : "border-gray-300";
  });

  const containerClasses = createMemo(() => {
    // return !open() ? "border-white" : "border-white";
    return "";
  });

  return (
    <div class="flex flex-col w-full items-center">
      <div
        class={`pt-4 w-full max-w-2xl xl:max-w-3xl flex flex-wrap flex-col ${containerClasses()}`}
      >
        <div
          class={`flex justify-end pr-2 pb-2 border-b-1 ${chevronContainerClasses()}`}
        >
          <ChevronToggle
            handleClick={handleClick}
            initialOpen={open()}
            duration={0.3}
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
                opacity: { duration: 0.5 },
                transform: { duration: 0.5 },
              }}
              exit={{
                opacity: 0,
                transform: "translateY(-20px)",
                transition: {
                  transform: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                },
              }}
              class="flex flex-row items-start justify-between w-full h-full px-2 pt-4"
            >
              <div>
                <div class="text-lg weather-time font-semibold">{getTime(time)}</div>
                <div class="weather-date">{getDateDescriptive(time)}</div>
                <div class="weather-temperature">{temperature.toFixed(1)}°</div>
                <div class="weather-precipitation">
                  {precipitation.toFixed(2)} mm
                </div>
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
