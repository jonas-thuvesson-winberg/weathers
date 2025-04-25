import { For } from "solid-js";
import logo from "../assets/logo.png";
import { FaSolidChevronUp } from "solid-icons/fa";

export const Header = () => {
  const links: [string, string][] = [
    // ["Home", "/"],
    // ["About", "/about"],
  ];

  const scrollToTop = () => {
    document
      .querySelector("body")!
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header class="header flex flex-row justify-between items-center w-full h-[80px] px-3 xs:px-9 lg:px-27 xl:px-36 bg-white">
      {" "}
      <div class="flex flex-row items-center">
        <img src={logo.src} alt="Logo" class="logo h-15 w-15" />
        <h1 class="px-4 text-2xl">Weathers</h1>{" "}
      </div>
      <div>
        <div>
          <FaSolidChevronUp
            onClick={scrollToTop}
            class="hover:cursor-pointer"
          />
        </div>
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
