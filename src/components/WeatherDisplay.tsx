import { createEffect, createSignal, mergeProps } from "solid-js";

export const WeatherDisplay = (props: { weatherData: any }) => {
  //const mergedProps = mergeProps({ fallback: ':(' })

  const merged = mergeProps({ greeting: "Hi", name: "John" }, props);
  const [data, setData] = createSignal(merged);
  //   console.log("props", JSON.stringify(props));
  setData(merged);
  createEffect(() => {
    // console.log("data: ", data());
  });

  return <h1>{data().weatherData}</h1>;
};
