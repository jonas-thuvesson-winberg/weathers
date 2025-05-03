import { children, createSignal, type ParentProps } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { ChevronToggle } from "../ChevronToggle";
import SectionHeader from "./SectionHeader";

interface WeatherDisplaySectionClientProps extends ParentProps {
  date: string;
}

export const WeatherDisplaySectionClient = (
  props: WeatherDisplaySectionClientProps
) => {
  const resolvedChildren = children(() => props.children);
  const { date } = props;

  const [open, setOpen] = createSignal(true);

  const handleClick = () => {
    setOpen(!open());
  };

  return (
    <>
      <div
        class={`flex justify-between items-center pr-2 pb-2 border-b-2 border-gray-300 dark:border-gray-600`}
      >
        <SectionHeader>{date}</SectionHeader>
        <ChevronToggle
          size="1.2rem"
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
                transform: { duration: 0.5 },
                opacity: { duration: 0.5 },
              },
            }}
          >
            {resolvedChildren()}
          </Motion.div>
        )}
      </Presence>
    </>
  );
};
