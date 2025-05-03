import { createSignal } from "solid-js";
import ScrollToTop, { type ClickEvt } from "./ScrollToTop";

const ScrollToTopFab = () => {
  const [clicked, setClicked] = createSignal<ClickEvt>({ clicked: false });

  return (
    <div
      onClick={() => setClicked({ clicked: true })}
      id="scroll-to-top-fab"
      class="hover:cursor-pointer fixed bottom-10 right-10 z-10000 background-white shadow-xl rounded-full p-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-900 border"
    >
      <ScrollToTop size="1.2rem" trigger={clicked} />
    </div>
  );
};

export default ScrollToTopFab;
