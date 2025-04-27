/** @jsxImportSource solid-js */

import { navigate } from "astro:transitions/client";
import { createSignal } from "solid-js";
import { LoadingUtils } from "../../utils/loading-utils";

const LocationInput = (
  props: { location: string } // Default value
) => {
  const [locationModel, setLocationModel] = createSignal(props.location);

  const setLocationStuff = (location: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("location", location);
    window.history.replaceState({}, "", `${url.pathname}?${params.toString()}`);
  };

  const handleInput = (e: Event) => {
    const t = (e.target as HTMLInputElement).value;
    setLocationModel(t);
    setLocationStuff(locationModel());
  };

  const handleSend = () => {
    if (LoadingUtils.isLoading()) return;
    refresh();
  };

  const handleEnter = (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    if (keyEvent.key !== "Enter") return;

    handleSend();
  };

  const handleClickSend = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    handleSend();
  };

  const refresh = () => {
    // Refresh the current page while preserving query parameters
    navigate(`${window.location.pathname}${window.location.search}`, {
      replace: true,
    } as any);
    // window.location.reload();
  };

  setLocationStuff(locationModel());

  return (
    <>
      <div class="flex justify-between flex-col sm:flex-row w-full">
        <input
          data-disable-while-loading
          type="search"
          id="location"
          name="location"
          value={locationModel()}
          class="text-lg border rounded-md px-2 py-2 mt-2 sm:mb-2 sm:mr-2 flex-3 border-gray-400"
          placeholder="location"
          onInput={handleInput}
          onKeyPress={handleEnter}
        />
        <button
          data-disable-while-loading
          type="button"
          class="text-lg hover:cursor-pointer bg-sky-300 hover:bg-sky-400 rounded-md px-4 py-2 my-2 text-white flex-1"
          onClick={handleClickSend}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default LocationInput;
