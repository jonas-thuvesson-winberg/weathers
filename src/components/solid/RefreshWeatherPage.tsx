/** @jsxImportSource solid-js */

import { navigate } from "astro:transitions/client";
import { IoRefreshCircle } from "solid-icons/io";
import { LoadingUtils } from "../../utils/loading-utils";

const RefreshWeatherPage = () => {
  const refresh = () => {
    if (LoadingUtils.isLoading()) return;
    // Refresh the current page while preserving query parameters
    navigate(`${window.location.pathname}${window.location.search}`, {
      replace: true,
    } as any);
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
