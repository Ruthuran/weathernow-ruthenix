import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";
import ForecastTabs from "./components/ForecastTabs";
import MapView from "./components/MapView";
import SunChart from "./components/SunChart";
import OverviewChart from "./components/OverviewChart";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("Washington");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [bgGradient, setBgGradient] = useState(
    "from-gray-950 via-gray-900 to-black"
  );

  // Convert city → lat/lon using Open-Meteo Geocoding
  const geocode = async (loc) => {
    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${loc}&count=1`
    );
    if (!geoRes.data.results?.length) throw new Error("City not found");
    return geoRes.data.results[0];
  };

  // Fetch current weather and forecast
  const fetchWeather = async (loc) => {
    if (!loc) return;
    try {
      setLoading(true);
      setError("");
      setAlert("");

      const geo = await geocode(loc);
      const { latitude, longitude, name, country } = geo;

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,weathercode,windspeed_10m,relativehumidity_2m,pressure_msl,visibility&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,windspeed_10m_max,relative_humidity_2m_max,cloudcover_mean&timezone=auto`
      );

      const data = weatherRes.data;

      // Format 12-hour forecast for Overview chart
      const hourlyData = data.hourly.time.slice(0, 12).map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: "2-digit" }),
        temp: Math.round(data.hourly.temperature_2m[i]),
        humidity: Math.round(data.hourly.relativehumidity_2m[i]),
        pressure: Math.round(data.hourly.pressure_msl[i]),
        visibility: data.hourly.visibility[i],
        wind: data.hourly.windspeed_10m[i],
      }));

      setWeather({
        city: `${name}, ${country}`,
        current: data.current_weather,
        daily: data.daily,
        location: { latitude, longitude, city: name },
      });

      setForecast(hourlyData);
      setCity(name);

      // Alerts
      const temp = data.current_weather.temperature;
      if (temp > 38) setAlert(`🔥 Heatwave Alert: ${name} is extremely hot!`);
      else if (temp < 5) setAlert(`❄️ Cold Warning: Stay warm in ${name}!`);

      // Dynamic gradient backgrounds
      if (temp > 30)
        setBgGradient("from-orange-900 via-red-800 to-yellow-600");
      else if (temp < 10)
        setBgGradient("from-gray-950 via-blue-900 to-cyan-700");
      else setBgGradient("from-slate-900 via-indigo-900 to-blue-800");
    } catch (err) {
      console.error("API Error:", err);
      setError("City not found or API error. Try another location.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchWeather(city), 600000);
    return () => clearInterval(interval);
  }, [city]);

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-b ${bgGradient} text-white p-6 transition-all duration-700 font-sans relative overflow-hidden`}
      key={city}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Navbar */}
      <Navbar onSearch={fetchWeather} />

      {/* Alerts */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-center py-2 rounded-lg mt-4 font-semibold backdrop-blur-lg shadow-[0_0_15px_rgba(255,255,0,0.2)]"
        >
          {alert}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12 text-cyan-400 animate-pulse tracking-wider text-lg"
        >
          Fetching live weather data...
        </motion.p>
      )}

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-red-400 bg-white/5 p-4 rounded-lg w-fit mx-auto border border-red-500/20 backdrop-blur-md shadow-lg"
        >
          {error}
        </motion.p>
      )}

      {/* Main Dashboard */}
      <AnimatePresence>
        {!loading && weather && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-12 mt-8">
              {/* Current Weather Card */}
              <WeatherCard data={weather} />

              {/* 5-Day Forecast Tabs */}
              <ForecastTabs forecast={weather.daily} />

              {/* Temperature Overview Chart */}
              <OverviewChart hourlyData={forecast} />

               {/* Live Location Map */}
              <MapView location={weather.location} />
            </div>

              {/* Sun Position Chart */}
              <SunChart
                sunrise={weather.daily.sunrise?.[0]}
                sunset={weather.daily.sunset?.[0]}
              />

             

            {/* 🌑 Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <Footer />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
