import React, { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

const WeatherCard = () => {
  const [city, setCity] = useState("bihta");
  const [weather, setWeather] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [clock, setClock] = useState(new Date());

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

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(clock);

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(clock);

  if (fetchError) return <div className="text-red-500">Weather: {fetchError}</div>;
  if (!weather) return <div className="text-white">Loading…</div>;

  const fullCityName = city === "bihta" ? "Bihta, Bihar" : "Patna, Bihar";

  return (
    <div className="relative bg-[#232B84] text-white rounded-xl p-4 w-[196px] h-[120px] shadow-md font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold mb-1">Sunny</h3>
          <p className="text-4xl font-bold">{Math.round(weather.temperature)}°</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{timeStr}</p>
          <p className="text-xs uppercase">{dateStr}</p>
        </div>
      </div>

      <div className="absolute bottom-2 right-2">
        <span className="bg-blue-200 text-[#232B84] text-xs px-3 py-[2px] rounded-full font-medium shadow-sm">
          {fullCityName}
        </span>
      </div>

      {/* Toggle button (optional, outside main design) */}
      <div className="absolute bottom-2 left-2">
        <button
          className="text-[10px] bg-white text-[#232B84] px-2 py-[2px] rounded-full"
          onClick={() => setCity((prev) => (prev === "bihta" ? "patna" : "bihta"))}
        >
          Show {city === "bihta" ? "Patna" : "Bihta"}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
