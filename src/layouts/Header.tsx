import { For } from "solid-js";

export const Header = () => {
  const links = [
    ["Home", "/"],
    ["About", "/about"],
  ];

  return (
    <header class="flex flex-row justify-between items-center w-full h-[80px] px-2 md:px-10 lg:px-20 bg-blue-400">
      {" "}
      <h1 class="px-4 text-2xl">Weathers</h1>{" "}
      <div>
        <ul>
          <For each={links}>
            {(item) => (
              <a class="px-4 hover:underline" href={item[1]}>
                {item[0]}
              </a>
            )}
          </For>
        </ul>
      </div>
    </header>
  );
};
