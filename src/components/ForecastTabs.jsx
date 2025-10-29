import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForecastTabs({ forecast }) {
  if (!forecast) return null;

  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Precipitation", "Wind", "Humidity", "Cloud Cover"];

  const dailyData = forecast?.time?.map((t, i) => ({
    date: new Date(t),
    max: forecast.temperature_2m_max?.[i],
    min: forecast.temperature_2m_min?.[i],
    rain: forecast.precipitation_sum?.[i],
    wind: forecast.windspeed_10m_max?.[i],
    humidity: forecast.relative_humidity_2m_max?.[i],
    clouds: forecast.cloudcover_mean?.[i],
  }));

  if (!dailyData?.length) return null;

  return (
    <div className="mt-16 text-white max-w-7xl mx-auto px-6">
      {/* Tabs with Animated Underline */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileTap={{ scale: 0.9 }}
            className={`relative px-6 py-2.5 rounded-full font-semibold backdrop-blur-xl overflow-hidden transition-all duration-500 border
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-400 text-black border-transparent shadow-lg shadow-yellow-500/40 scale-105"
                  : "bg-white/5 hover:bg-white/15 border-white/10 text-gray-300"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-orange-500/40 rounded-full blur-xl"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Forecast Cards */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
      >
        {dailyData.slice(0, 5).map((day, index) => (
          <motion.div
            key={index}
            layout
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 30px rgba(255, 200, 0, 0.25)",
            }}
            className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl p-6 rounded-3xl text-center border border-white/10 shadow-xl transition-all duration-700 hover:shadow-yellow-400/30 group overflow-hidden"
          >
            {/* Shimmer Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-transparent to-orange-400/10 opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl"></div>

            <p className="font-semibold text-lg mb-3 tracking-wide text-white/90">
              {day.date.toLocaleDateString("en-US", { weekday: "short" })}
            </p>

            {/* Weather Icon */}
            <motion.img
              src={`https://cdn.weatherapi.com/weather/64x64/day/${getWeatherIcon(
                activeTab,
                index
              )}.png`}
              onError={(e) =>
                (e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/1163/1163661.png")
              }
              alt="weather icon"
              className="h-14 w-14 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,204,0,0.4)] transition-all"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Animated Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {activeTab === "Overview" && (
                  <>
                    <p className="text-2xl font-bold text-yellow-300">
                      {Math.round(day.max)}° / {Math.round(day.min)}°
                    </p>
                    <p className="text-sm opacity-70 mt-1">Temp Range</p>
                  </>
                )}
                {activeTab === "Precipitation" && (
                  <p className="text-lg font-medium text-blue-300">
                    💧 {day.rain ?? 0} mm
                  </p>
                )}
                {activeTab === "Wind" && (
                  <p className="text-lg font-medium text-cyan-300">
                    🌬️ {day.wind ?? 0} km/h
                  </p>
                )}
                {activeTab === "Humidity" && (
                  <p className="text-lg font-medium text-indigo-300">
                    💦 {day.humidity ?? "--"}%
                  </p>
                )}
                {activeTab === "Cloud Cover" && (
                  <p className="text-lg font-medium text-gray-300">
                    ☁️ {day.clouds ?? "--"}%
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Glowing Ambient Line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-[2px] mt-14 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm"
      />
    </div>
  );
}

// Helper function
function getWeatherIcon(tab, index) {
  const baseIcons = ["113", "116", "296", "119", "122"];
  const tabAdjustments = {
    Overview: baseIcons,
    Precipitation: ["296", "308", "302", "299", "305"],
    Wind: ["260", "266", "176", "293", "350"],
    Humidity: ["143", "122", "176", "248", "353"],
    "Cloud Cover": ["119", "122", "143", "116", "119"],
  };
  const set = tabAdjustments[tab] || baseIcons;
  return set[index % set.length];
}
