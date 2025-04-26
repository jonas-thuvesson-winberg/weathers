import { children, type ParentProps } from "solid-js";

const SectionHeader = (props: ParentProps) => {
  const resolvedChildren = children(() => props.children);
  return (
    <h1 class="font-semibold text-xl text-gray-500">{resolvedChildren()}</h1>
  );
};

export default SectionHeader;
