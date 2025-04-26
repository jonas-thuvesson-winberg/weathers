import { createMemo, createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import { FaSolidChevronUp } from "solid-icons/fa";

export const ChevronToggle = (props: {
  initialOpen: boolean;
  duration: number;
  size: string;
  handleClick: (evt: Event) => void;
}) => {
  const [open, setOpen] = createSignal(props.initialOpen);

  const handleClickInternal = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(!open());
    props.handleClick(e);
  };

  return (
    <Motion.div
      animate={{ rotate: open() ? 0 : 180 }}
      transition={{ duration: props.duration }}
      class="inline"
      onClick={(e) => handleClickInternal(e)}
    >
      <FaSolidChevronUp size={props.size} class="hover:cursor-pointer" />
    </Motion.div>
  );
};
