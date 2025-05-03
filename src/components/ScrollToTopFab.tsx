import { createSignal } from "solid-js";
import ScrollToTop, { type ClickEvt } from "./ScrollToTop";

const ScrollToTopFab = () => {
  const [clicked, setClicked] = createSignal<ClickEvt>({ clicked: false });

  return (
    <div
      onClick={() => setClicked({ clicked: true })}
      id="scroll-to-top-fab"
      class="hover:cursor-pointer fixed bottom-5 right-5 z-10000 background-white shadow-xl rounded-full p-6 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 border-2"
    >
      <ScrollToTop size="1.2rem" trigger={clicked} />
    </div>
  );
};

export default ScrollToTopFab;
