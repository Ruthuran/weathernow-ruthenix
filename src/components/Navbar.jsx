import { motion } from "framer-motion";
import { Search, SunMedium, CloudRain, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar({ onSearch }) {
  const [city, setCity] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [suggestions, setSuggestions] = useState([]);

  // Live clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch matching city suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) return setSuggestions([]);
    try {
      const res = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=6`
      );
      setSuggestions(res.data.results || []);
    } catch {
      setSuggestions([]);
    }
  };

  //  Debounced search as user types
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (city.length > 1) fetchSuggestions(city);
    }, 400);
    return () => clearTimeout(timeout);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity("");
      setSuggestions([]);
    }
  };

  const handleSelect = (selectedCity) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    setSuggestions([]);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full backdrop-blur-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-gray-900/40 border-b border-white/10 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 text-white relative">
        {/* 🌦 Brand / Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl tracking-wide">
          <SunMedium className="text-yellow-300 w-6 h-6 animate-pulse" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-yellow-300 via-orange-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          >
            RUTHENIX{" "}
            <span className="font-medium opacity-90 text-blue-300">
              WeatherNow
            </span>
          </motion.span>
        </div>

        {/* Search Bar + Suggestions */}
        <div className="relative">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-5 py-2 w-72 backdrop-blur-md focus-within:ring-2 ring-blue-400 transition-all shadow-inner"
          >
            <MapPin size={18} className="opacity-70 text-blue-300" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any city..."
              className="bg-transparent outline-none text-sm placeholder-white/60 w-full text-white"
            />
            <button
              type="submit"
              className="hover:scale-110 transition-transform text-blue-300"
              title="Search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-gray-950/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg overflow-y-auto max-h-60 z-50">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(`${s.name}, ${s.country}`)}
                  className="px-4 py-2 text-sm hover:bg-blue-500/20 cursor-pointer transition-all"
                >
                  <span className="font-medium text-white">{s.name}</span>
                  {s.admin1 && (
                    <span className="text-gray-400 ml-1 text-xs">
                      ({s.admin1})
                    </span>
                  )}
                  <span className="text-gray-400 text-xs ml-1">
                    — {s.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right-side info */}
        <div className="hidden sm:flex items-center gap-4 opacity-90 text-sm">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-300 animate-pulse" />
            <p className="text-blue-300 font-medium">Live Forecast</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-yellow-300" />
            <span className="text-gray-200">{time}</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
