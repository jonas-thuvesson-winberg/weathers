import { navigate } from "astro:transitions/client";
import { IoRefreshCircle } from "solid-icons/io";

const RefreshWeatherPage = () => {
  const refresh = () => {
    console.log("Refreshing weather data...");
    // Refresh the current page while preserving query parameters
    navigate(`${window.location.pathname}${window.location.search}`, {
      replace: true,
    } as any);
    // window.location.reload();
  };

  return (
    <IoRefreshCircle
      size="3rem"
      class="hover:cursor-pointer"
      onClick={() => refresh()}
    />
  );
};

export default RefreshWeatherPage;
