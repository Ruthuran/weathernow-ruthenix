import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function SunChart({ sunrise, sunset }) {
  if (!sunrise || !sunset)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-white/70 mt-6 backdrop-blur-md bg-gradient-to-br from-gray-900/40 to-gray-800/20 p-6 rounded-2xl shadow-lg border border-white/10"
      >
        🌅 Sunrise/Sunset data not available.
      </motion.div>
    );

  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);
  const daylightHours = Math.round((sunset - sunrise) / 3600);

  // Simulated sun arc (you can later replace with real hourly data)
  const data = [
    { time: "6 AM", sun: 0 },
    { time: "8 AM", sun: 25 },
    { time: "10 AM", sun: 55 },
    { time: "12 PM", sun: 100 },
    { time: "2 PM", sun: 85 },
    { time: "4 PM", sun: 50 },
    { time: "6 PM", sun: 10 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-10 relative overflow-hidden bg-gradient-to-b from-amber-950/60 via-orange-900/40 to-amber-800/30 backdrop-blur-xl p-8 rounded-3xl text-white max-w-3xl mx-auto shadow-2xl border border-white/10 hover:scale-[1.02] transition-all duration-700"
    >
      {/* 🌞 Glow Effects */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-600/20 to-transparent blur-3xl pointer-events-none" />

      {/* 🌅 Title */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-300">
          🌞 Sunrise & Sunset Overview
        </h3>
        <p className="text-sm text-white/70 tracking-wider uppercase">
          Daylight Duration
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#fde68a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "0.85rem",
                boxShadow: "0 0 20px rgba(251,191,36,0.2)",
                backdropFilter: "blur(10px)",
              }}
              cursor={{ stroke: "#fbbf24", strokeWidth: 1 }}
              formatter={(value) => [`${value}%`, "Sun Intensity"]}
            />
            <Area
              type="monotone"
              dataKey="sun"
              stroke="#fde68a"
              strokeWidth={3}
              fill="url(#sunGradient)"
              dot={{ r: 4, fill: "#fbbf24", strokeWidth: 0 }}
              activeDot={{ r: 7, fill: "#facc15", strokeWidth: 0 }}
              animationDuration={1800}
            />

            {/* 🌅 Sunrise Marker */}
            <ReferenceLine
              x="6 AM"
              label={{
                value: "🌅 Sunrise",
                fill: "#fef08a",
                position: "top",
                fontSize: 12,
              }}
              stroke="#fde68a"
              strokeDasharray="4 3"
            />

            {/* 🌇 Sunset Marker */}
            <ReferenceLine
              x="6 PM"
              label={{
                value: "🌇 Sunset",
                fill: "#fef08a",
                position: "top",
                fontSize: 12,
              }}
              stroke="#fde68a"
              strokeDasharray="4 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sunrise/Sunset Times */}
      <div className="flex justify-between text-sm text-yellow-300 mt-6 font-medium">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🌅 {sunriseTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌇 {sunsetTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </motion.p>
      </div>

      {/* Daylight Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-4 text-white/80 text-sm"
      >
        ☀️{" "}
        <span className="text-yellow-400 font-semibold">{daylightHours} hours</span> of
        daylight today
      </motion.div>
    </motion.div>
  );
}
