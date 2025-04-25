import { children, createSignal } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { ChevronToggle } from "./ChevronToggle";

export const WeatherEntryClient = (props: { children: any }) => {
  const resolvedChildren = children(() => props.children);

  const [open, setOpen] = createSignal(true);

  const handleClick = () => {
    setOpen(!open());
  };

  return (
    <>
      <div class={`flex justify-end pr-2 pb-2 border-b-1 border-gray-300`}>
        <ChevronToggle
          size="1rem"
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
          >
            {resolvedChildren()}
          </Motion.div>
        )}
      </Presence>
    </>
  );
};
