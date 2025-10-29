import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  CloudSnow,
} from "lucide-react";

export default function WeatherCard({ data }) {
  if (!data) return null;

  // Extract Open-Meteo structured data
  const weather = data.current || data.current_weather || {};
  const cityName = data.city || "Unknown";
  const daily = data.daily || {};

  // Fix sunrise/sunset (Open-Meteo returns ISO strings, not timestamps)
  const sunriseTime = daily.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  const sunsetTime = daily.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  // Weather data
  const temp = Math.round(weather.temperature ?? 0);
  const feelsLike = Math.round(weather.apparent_temperature ?? temp);
  const windspeed = Math.round(weather.windspeed ?? 0);
  const humidity = Math.round(daily.relativehumidity_2m_mean?.[0] ?? 60);
  const pressure = Math.round(daily.pressure_msl_mean?.[0] ?? 1013);
  const visibility = "10,000"; // Open-Meteo doesn’t return visibility by default
  const precipitation =
    daily.precipitation_sum?.[0] !== undefined
      ? `${daily.precipitation_sum[0]} mm`
      : "0 mm";
  const uvIndex =
    daily.uv_index_max?.[0] !== undefined ? daily.uv_index_max[0] : "--";

  // Simple weather description from temperature
  let description = "Clear sky";
  if (temp < 5) description = "Cold and breezy";
  else if (temp < 15) description = "Cool and pleasant";
  else if (temp < 30) description = "Warm and clear";
  else description = "Hot and sunny";

  // Icon mapping
  const weatherIcons = {
    clear: (
      <Sun className="text-yellow-400 w-20 h-20 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
    ),
    clouds: (
      <Cloud className="text-gray-300 w-20 h-20 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
    ),
    rain: (
      <CloudRain className="text-blue-300 w-20 h-20 drop-shadow-[0_0_25px_rgba(96,165,250,0.4)]" />
    ),
    snow: (
      <CloudSnow className="text-blue-100 w-20 h-20 drop-shadow-[0_0_25px_rgba(191,219,254,0.4)]" />
    ),
  };

  const iconKey =
    temp < 5
      ? "snow"
      : temp < 25
      ? "clear"
      : temp < 35
      ? "clouds"
      : "rain";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900/60 to-indigo-800/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 rounded-3xl text-white max-w-3xl mx-auto hover:scale-[1.02] transition-all duration-700"
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_70%)]" />

      {/* Location Header */}
      <div className="flex justify-between items-center relative z-10 mb-6">
        <div>
          <h2 className="text-4xl font-bold tracking-wide">{cityName}</h2>
          <p className="text-lg opacity-80 capitalize mt-1">{description}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 6 }}
          transition={{ duration: 0.5 }}
          className="drop-shadow-lg"
        >
          {weatherIcons[iconKey] || weatherIcons.clear}
        </motion.div>
      </div>

      {/* Temperature & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-yellow-200 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            {temp}°C
          </motion.p>
          <p className="text-lg opacity-90 mt-2">
            Feels like{" "}
            <span className="font-semibold text-blue-200">{feelsLike}°C</span>
          </p>

          {/* Temperature Bar */}
          <div className="mt-4 w-40 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(Math.max((temp / 40) * 100, 0), 100)}%`,
              }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-yellow-300 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>

        {/* Weather Stats */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="text-sm leading-relaxed space-y-2 bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 shadow-inner"
        >
          <p className="flex items-center gap-2">
            <Wind size={18} /> <span className="opacity-80">Wind:</span>{" "}
            {windspeed} km/h
          </p>
          <p className="flex items-center gap-2">
            <Droplets size={18} /> <span className="opacity-80">Humidity:</span>{" "}
            {humidity}%
          </p>
          <p className="flex items-center gap-2">
            <Thermometer size={18} />{" "}
            <span className="opacity-80">Pressure:</span> {pressure} hPa
          </p>
          <p className="flex items-center gap-2">
            <Eye size={18} /> <span className="opacity-80">Visibility:</span>{" "}
            {visibility} m
          </p>
        </motion.div>
      </div>

      {/* Sunrise / Sunset / UV / Rain */}
      <div className="grid grid-cols-2 sm:grid-cols-4 mt-8 gap-4 text-sm text-center relative z-10">
        {[
          { label: "🌅 Sunrise", value: sunriseTime },
          { label: "🌇 Sunset", value: sunsetTime },
          { label: "☀️ UV Index", value: uvIndex },
          { label: "💧 Precipitation", value: precipitation },
        ].map((info, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10 shadow-lg hover:bg-white/20 transition-all"
          >
            <p className="opacity-70 text-xs mb-1">{info.label}</p>
            <p className="font-medium text-lg text-blue-200">{info.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
