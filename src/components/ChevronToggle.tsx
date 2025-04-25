import { createMemo, createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import { FaSolidChevronUp } from "solid-icons/fa";

export const ChevronToggle = ({
  initialOpen,
  duration,
  size,
  handleClick,
}: {
  initialOpen: boolean;
  duration: number;
  size: string;
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
      class="inline"
      onClick={(e) => handleClickInternal(e)}
    >
      <FaSolidChevronUp size={size} class="hover:cursor-pointer" />
    </Motion.div>
  );
};
