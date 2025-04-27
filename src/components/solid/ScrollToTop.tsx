/** @jsxImportSource solid-js */

import { FaSolidArrowUp, FaSolidChevronUp } from "solid-icons/fa";
import { createEffect, createSignal, type Accessor } from "solid-js";

export interface ClickEvt {
  clicked: boolean;
}

const ScrollToTop = (props: {
  size?: string;
  trigger?: Accessor<ClickEvt>;
}) => {
  const [size] = createSignal(props.size || "1.2rem");

  createEffect(() => {
    if (props?.trigger?.().clicked) {
      scrollToTop();
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToTop = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // if (props.trigger) return;
    scrollToTop();
  };

  return (
    <FaSolidArrowUp
      size={size()}
      onClick={handleScrollToTop}
      class="hover:cursor-pointer"
    />
  );
};

export default ScrollToTop;
