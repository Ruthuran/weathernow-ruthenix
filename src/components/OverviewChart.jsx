import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Sun, Moon, Droplets, Gauge, Thermometer } from "lucide-react";

export default function OverviewChart({ hourlyData, sunrise, sunset }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  const avgTemp =
    hourlyData.reduce((sum, d) => sum + (d.temp || 0), 0) / hourlyData.length;
  const avgHumidity = Math.round(
    hourlyData.reduce((sum, d) => sum + (d.humidity || 0), 0) /
      hourlyData.length
  );
  const avgPressure = Math.round(
    hourlyData.reduce((sum, d) => sum + (d.pressure || 0), 0) /
      hourlyData.length
  );

  const gradientColor =
    avgTemp < 10 ? "#38BDF8" : avgTemp < 25 ? "#FACC15" : "#F87171";

  return (
    <motion.div
      className="relative bg-gradient-to-b from-slate-950/80 via-indigo-950/60 to-slate-900/50 backdrop-blur-3xl text-white p-10 rounded-3xl shadow-2xl border border-white/10 mx-auto mt-10 max-w-6xl overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_60%)] pointer-events-none" />

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3 relative z-10">
        <div className="flex items-center gap-3 text-3xl font-semibold">
          <Sun className="text-yellow-300 w-7 h-7 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
          <span className="bg-gradient-to-r from-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Daily Overview
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <button className="px-3 py-1 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 hover:scale-105 transition-all">
            Feels like
          </button>
          <button className="px-3 py-1 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 hover:scale-105 transition-all">
            Temperature
          </button>
        </div>
      </div>

      {/* Area Chart */}
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.9} />
                <stop offset="90%" stopColor={gradientColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="white"
              tick={{ fill: "#E2E8F0", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(30,41,59,0.8)",
                border: "none",
                borderRadius: "12px",
                color: "#E2E8F0",
                padding: "10px 14px",
                boxShadow: "0 0 15px rgba(250,204,21,0.15)",
                backdropFilter: "blur(8px)",
              }}
              labelStyle={{
                color: "#FACC15",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
              formatter={(v) => [`${v}°C`, "Temperature"]}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={gradientColor}
              strokeWidth={3}
              fill="url(#tempGradient)"
              dot={{ r: 3.5, fill: "#fde68a", strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: "#facc15",
                strokeWidth: 0,
                stroke: "rgba(250,204,21,0.3)",
              }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sunrise / Sunset Timeline */}
      <div className="relative mt-10 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-indigo-800 animate-[shine_4s_ease-in-out_infinite_alternate]"
          style={{ width: "60%" }}
        ></div>

        {/* Moving sun glow */}
        <motion.div
          className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_20px_5px_rgba(250,204,21,0.6)]"
          animate={{ left: ["0%", "60%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        />

        <div className="absolute -top-6 left-0 flex items-center gap-1 text-xs text-yellow-300">
          <Sun size={14} />
          <span>
            {sunrise
              ? new Date(sunrise).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </span>
        </div>
        <div className="absolute -top-6 right-0 flex items-center gap-1 text-xs text-indigo-300">
          <Moon size={14} />
          <span>
            {sunset
              ? new Date(sunset).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 relative z-10">
        <StatCard
          icon={<Droplets className="text-blue-300" size={22} />}
          label="Humidity"
          value={`${avgHumidity}%`}
        />
        <StatCard
          icon={<Gauge className="text-cyan-300" size={22} />}
          label="Pressure"
          value={`${avgPressure} hPa`}
        />
        <StatCard
          icon={<Thermometer className="text-yellow-300" size={22} />}
          label="Avg Temp"
          value={`${avgTemp.toFixed(1)}°C`}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(250,204,21,0.15)]"
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm opacity-75">{label}</p>
      <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]">
        {value}
      </h3>
    </motion.div>
  );
}
