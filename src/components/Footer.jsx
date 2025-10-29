import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="relative overflow-hidden bg-gradient-to-tr from-gray-950 via-gray-900 to-black text-gray-300 py-12 px-6 mt-20 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full animate-pulse delay-300" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        {/* Brand Section */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 tracking-wider drop-shadow-lg">
            RUTHENIX
          </h3>
          <p className="text-sm mt-2 text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            {
              href: "https://github.com/Ruthuran",
              icon: <Github size={24} />,
              label: "GitHub",
            },
            {
              href: "https://www.linkedin.com/in/ruthuran-muralirajan/",
              icon: <Linkedin size={24} />,
              label: "LinkedIn",
            },
            {
              href: "mailto:ruthuranmuralirajan1@gmail.com",
              icon: <Mail size={24} />,
              label: "Email",
            },
          ].map(({ href, icon, label }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.2,
                rotate: 5,
                color: "#3b82f6",
              }}
              whileTap={{ scale: 0.9 }}
              className="relative group transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md border border-gray-700 shadow-md group-hover:shadow-blue-500/30">
                {icon}
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Animated Line */}
      <motion.div
        className="relative mt-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        style={{ transformOrigin: "center" }}
      />

      {/* Tagline */}
      <motion.p
        className="text-sm text-center mt-6 text-gray-400 tracking-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Crafted with <span className="text-red-400">❤️</span> by{" "}
        <span className="text-white font-semibold">RUTHURAN</span> — Powered by{" "}
        <span className="text-blue-400 font-bold">RUTHENIX</span>
      </motion.p>
    </motion.footer>
  );
}
