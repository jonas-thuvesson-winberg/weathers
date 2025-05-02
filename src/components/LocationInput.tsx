import { navigate } from "astro:transitions/client";
import { createSignal } from "solid-js";
import { LoadingUtils } from "../utils/loading-utils";
import { FaSolidLocationDot } from "solid-icons/fa";
import { FiSearch } from "solid-icons/fi";

const LocationInput = (props: { location: string }) => {
  const [locationModel, setLocationModel] = createSignal(props.location);

  const setLocation = (location: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("location", location);
    window.history.replaceState({}, "", `${url.pathname}?${params.toString()}`);
  };

  const handleInput = (e: Event) => {
    const t = (e.target as HTMLInputElement).value;
    setLocationModel(t);
    setLocation(locationModel());
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

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      LoadingUtils.dispatchLoading();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lat: latitude, long: longitude }),
          })
            .then((response) => {
              if (!response.ok) {
                LoadingUtils.dispatchLoaded();
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Location data:", data);

              setLocationModel(data.location);
              setLocation(locationModel());
              LoadingUtils.dispatchLoaded();
            });
        },
        (error) => {
          console.error(`Error (${error.code}): ${error.message}`);
          LoadingUtils.dispatchLoaded();
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  setLocation(locationModel());

  return (
    <>
      <div class="flex justify-between items-center flex-col sm:flex-row w-full gap-2">
        <div class="flex flex-row items-center justify-between gap-2 flex-3 w-full">
          <input
            data-disable-while-loading
            type="search"
            id="location"
            name="location"
            value={locationModel()}
            class="text-lg border rounded-md px-2 py-2 mt-2 sm:mb-2 flex-1 border-gray-400"
            placeholder="location"
            onInput={handleInput}
            onKeyPress={handleEnter}
          />
          <FaSolidLocationDot
            data-disable-while-loading
            size={"2rem"}
            class="text-sky-400 hover:cursor-pointer hover:text-sky-500"
            onClick={handleGetLocation}
          />
        </div>
        <button
          data-disable-while-loading
          type="button"
          class="flex flex-row justify-between items-center text-lg hover:cursor-pointer bg-sky-300 hover:bg-sky-400 rounded-md px-4 py-2 my-2 text-white flex-1 w-full"
          onClick={handleClickSend}
        >
          <span class="ml-2">Search</span>{" "}
          <FiSearch
            data-disable-while-loading
            size={"2rem"}
            class="text-white mr-2"
          />
        </button>
      </div>
    </>
  );
};

export default LocationInput;
