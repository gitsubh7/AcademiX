
/**
 * Fetch live weather for a city.
 * @param {string} city  Either "bihta", "patna", … (defaults to "bihta")
 * @returns {Promise<{city:string, temperature:number, time:string, weathercode:number}>}
 */
export async function getWeather(city = "bihta") {
 const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/weather/${city}`, {
  credentials: "include",
});


  if (!res.ok) {
    const { message } = await res.json().catch(() => ({}));
    throw new Error(message || "Unable to fetch weather");
  }
  const payload = await res.json();
  return payload.message; 
}
