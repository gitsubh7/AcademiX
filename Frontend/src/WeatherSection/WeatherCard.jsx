import React, { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

const WeatherCard = () => {
  const [city, setCity] = useState("bihta");
  const [weather, setWeather] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [clock, setClock] = useState(new Date());

  // Fetch weather on city change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getWeather(city);
        if (!cancelled) {
          setWeather(data);
          setFetchError(null);
        }
      } catch (err) {
        if (!cancelled) setFetchError(err.message || "Error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city]);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Time formatter
  const timeStr = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(clock);

  if (fetchError) {
    return <div className="text-red-500">Weather: {fetchError}</div>;
  }

  if (!weather) {
    return <div className="text-white">Loading…</div>;
  }

  return (
    <div className="bg-[#2e3192] text-white rounded-xl p-4 w-[220px] text-center shadow-lg select-none">
      <h3 className="text-sm font-medium">Weather</h3>

      {/* Weather code mapping can be improved here */}
      <p className="text-lg font-semibold mb-1">Sunny</p>

      <p className="text-4xl font-bold">
        {Math.round(weather.temperature)}°
      </p>

      <p className="text-sm mt-1">{timeStr}</p>
      <p className="text-sm mb-2">{weather.city}</p>

      {/* Toggle button */}
      <button
        className="bg-white text-[#2e3192] text-sm px-3 py-1 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200"
        onClick={() => setCity((prev) => (prev === "bihta" ? "patna" : "bihta"))}
      >
        Show {city === "bihta" ? "Patna" : "Bihta"}
      </button>
    </div>
  );
};

export default WeatherCard;
