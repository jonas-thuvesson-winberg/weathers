export const setCookie = (name: string, value: string, options = {}): void => {
  if (typeof document !== "undefined") {
    const cookieOptions = {
      httpOnly: false,
      sameSite: "strict",
      path: "/",
      ...options,
    };
    document.cookie = `${name}=${value}; ${Object.entries(cookieOptions)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ")}`;
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }
  return null;
};
