// src/services/weatherService.js
// src/services/weatherService.js
// -------------------------------------------------
// Simple helper for fetching weather from your backend
// -------------------------------------------------

/**
 * Fetch live weather for a city.
 * @param {string} city  Either "bihta", "patna", … (defaults to "bihta")
 * @returns {Promise<{city:string, temperature:number, time:string, weathercode:number}>}
 */
export async function getWeather(city = "bihta") {
  const res = await fetch(`http://localhost:3000/api/v1/weather/${city}`, {
    credentials: "include",        // remove if you don’t need cookies
  });

  if (!res.ok) {
    // Bubble up a readable error message
    const { message } = await res.json().catch(() => ({}));
    throw new Error(message || "Unable to fetch weather");
  }

  /**
   * Your backend wraps the useful data inside:
   * { statusCode, data: "Data fetched successfully", message: { …actualWeather } }
   * So we need the `.message` field.
   */
  const payload = await res.json();
  return payload.message; // { city, temperature, time, weathercode }
}
