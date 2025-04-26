import { FaSolidArrowUp, FaSolidChevronUp } from "solid-icons/fa";

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FaSolidArrowUp
      onClick={scrollToTop}
      class="hover:cursor-pointer"
    />
  );
};

export default ScrollToTop;
