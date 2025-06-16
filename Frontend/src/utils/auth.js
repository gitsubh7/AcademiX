export const getAccessToken = () => localStorage.getItem("gAccess");
export const getRefreshToken = () => localStorage.getItem("gRefresh");
export const clearTokens     = () => {
  localStorage.removeItem("gAccess");
  localStorage.removeItem("gRefresh");
};