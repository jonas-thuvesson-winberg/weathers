import { FaSolidChevronUp } from "solid-icons/fa";

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FaSolidChevronUp
      onClick={scrollToTop}
      class="hover:cursor-pointer"
      id="scroll-to-top"
    />
  );
};

export default ScrollToTop;
