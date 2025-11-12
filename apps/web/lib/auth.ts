export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
export const setAccessToken = (t: string) => {
  if (typeof window !== "undefined") localStorage.setItem("accessToken", t);
};
export const clearAccessToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("accessToken");
};
export const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
export const setRefreshToken = (t: string) => {
  if (typeof window !== "undefined") localStorage.setItem("refreshToken", t);
};
export const clearRefreshToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("refreshToken");
};
