import { createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import { FaSolidChevronUp } from "solid-icons/fa";

export const ChevronToggle = ({
  initialOpen,
  duration,
  handleClick,
}: {
  initialOpen: boolean;
  duration: number;
  handleClick: (evt: Event) => void;
}) => {
  const [open, setOpen] = createSignal(initialOpen);

  const handleClickInternal = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(!open());
    handleClick(e);
  };

  return (
    <Motion.div
      animate={{ rotate: open() ? 0 : 180 }}
      transition={{ duration }}
      style={{ display: "inline-block" }}
      onClick={(e) => handleClickInternal(e)}
    >
      <FaSolidChevronUp class="hover:cursor-pointer" />
    </Motion.div>
  );
};
