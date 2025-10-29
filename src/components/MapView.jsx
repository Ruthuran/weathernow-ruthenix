import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { Sun, Moon, ZoomIn, ZoomOut } from "lucide-react";

// Custom weather icon
const weatherIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -40],
});

// Smooth camera animation
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 8, { duration: 1.8 });
  }, [center, map]);
  return null;
}

export default function MapView({ location }) {
  const [darkMode, setDarkMode] = useState(false);
  const [zoom, setZoom] = useState(8);

  if (!location) return null;

  const {
    latitude,
    longitude,
    city,
    temperature,
    windspeed,
    humidity,
    pressure,
  } = location;

  const center = [latitude, longitude];
  const tileUrl = darkMode
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <motion.div
      className="relative mt-10 bg-gradient-to-br from-indigo-900/40 to-blue-700/40 backdrop-blur-xl p-6 rounded-3xl text-white max-w-5xl mx-auto shadow-2xl border border-white/10 hover:shadow-blue-400/30 transition-all duration-700 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          🗺️ Live Map View
        </h3>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition-all"
        >
          {darkMode ? (
            <>
              <Sun size={16} className="text-yellow-300" /> Light Mode
            </>
          ) : (
            <>
              <Moon size={16} className="text-blue-300" /> Dark Mode
            </>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          className="h-80 w-full z-0"
        >
          <ChangeView center={center} />
          <TileLayer attribution="&copy; OpenStreetMap" url={tileUrl} />
          <Marker position={center} icon={weatherIcon}>
            <Popup>
              <div className="text-sm leading-relaxed">
                <strong className="block text-lg mb-1">{city}</strong>
                <p>🌡️ Temperature: {temperature ?? "--"}°C</p>
                <p>💨 Wind: {windspeed ?? "--"} km/h</p>
                <p>💧 Humidity: {humidity ? `${humidity}%` : "--%"}</p>
                <p>🌡️ Pressure: {pressure ? `${pressure} hPa` : "— hPa"}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Glowing ring around location */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-20 h-20 bg-blue-400/30 rounded-full blur-3xl animate-ping"></div>
          <div className="w-16 h-16 bg-yellow-300/20 rounded-full blur-lg animate-pulse"></div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[999]">
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 18))}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md shadow-md transition-all"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 3))}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md shadow-md transition-all"
          >
            <ZoomOut size={18} />
          </button>
        </div>
      </div>

      {/* Floating Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-6 text-center bg-white/10 rounded-xl p-4 shadow-md border border-white/10 backdrop-blur-lg"
      >
        <p className="text-lg font-semibold">{city}</p>
        <p className="text-sm opacity-75">
          Latitude: {latitude.toFixed(2)} | Longitude: {longitude.toFixed(2)}
        </p>
      </motion.div>

      <p className="text-sm text-center opacity-60 mt-4">
        🌍 Map powered by <span className="font-semibold">OpenStreetMap</span> &{" "}
        <span className="font-semibold">RUTHENIX</span>
      </p>
    </motion.div>
  );
}
