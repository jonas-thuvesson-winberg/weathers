import type { AstroCookies } from "astro";

// utils/cookies.ts
export function setCookie(
  cookies: AstroCookies,
  name: string,
  value: string,
  options = {}
) {
  cookies.set(name, value, {
    httpOnly: false,
    sameSite: "strict",
    path: "/",
    ...options,
  });
}

export function getCookie(cookies: AstroCookies, name: string) {
  return cookies.get(name);
}
