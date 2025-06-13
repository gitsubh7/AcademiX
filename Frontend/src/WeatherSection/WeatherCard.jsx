import React, { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

const WeatherCard = ({ city = "bihta" }) => {
  const [weather, setWeather] = useState(null);     // {temperature, city, …}
  const [fetchError, setFetchError] = useState(null);
  const [clock, setClock] = useState(new Date());   // live browser clock

  /* ─────────── Fetch temperature once ─────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getWeather(city);        // { city, temperature, … }
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

  /* ─────────── Live clock ticker ─────────── */
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000); // update every second
    return () => clearInterval(id);
  }, []);

  /* ─────────── Render states ─────────── */
  if (fetchError) {
    return <div className="text-red-500">Weather: {fetchError}</div>;
  }
  if (!weather) {
    return <div className="text-white">Loading…</div>;
  }

  /* ─────────── Format live time ─────────── */
  const timeStr = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(clock);

  return (
    <div className="bg-[#2e3192] text-white rounded-xl p-4 w-[200px] text-center shadow-lg select-none">
      <h3 className="text-sm font-medium">Weather</h3>

      {/* You can map weather.weathercode → text/icon here if desired */}
      <p className="text-lg font-semibold mb-1">Sunny</p>

      <p className="text-4xl font-bold">
        {Math.round(weather.temperature)}°
      </p>

      {/* live clock */}
      <p className="text-sm mt-1">{timeStr}</p>

      <p className="text-sm">{weather.city}</p>
    </div>
  );
};

export default WeatherCard;
