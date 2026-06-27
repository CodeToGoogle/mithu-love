import { useMemo } from "react";
import { motion } from "framer-motion";
import "../styles/FloatingHearts.css";

const defaultMessage = "I Love You Mithu";

/**
 * Renders a fixed full-page layer of hearts that drift upward like
 * rising embers. Sits behind page content (pointer-events: none).
 *
 * density: how many hearts to render at once
 */
export default function FloatingHearts({
  density = 18,
  message = defaultMessage,
  durationMin = 5.4,
  durationMax = 8.6,
  driftRange = 130,
  className = "",
}) {
  const hearts = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const size = 58 + Math.random() * 36;
      const left = Math.random() * 100;
      const duration = durationMin + Math.random() * (durationMax - durationMin);
      const delay = Math.random() * 1.1;
      const drift = (Math.random() - 0.5) * driftRange;
      const opacity = 0.45 + Math.random() * 0.35;
      const hue = Math.random() > 0.5 ? "#ff74a4" : "#ffd8e3";
      const text = i % 2 === 0 ? message : defaultMessage;
      return { id: i, size, left, duration, delay, drift, opacity, hue, text };
    });
  }, [density, message, durationMin, durationMax, driftRange]);

  return (
    <div className={`hearts-layer${className ? ` ${className}` : ""}`} aria-hidden="true">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="heart-particle"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: h.hue,
            opacity: h.opacity,
          }}
          initial={{ y: "100vh", x: 0, opacity: 0, rotate: -8, scale: 0.72 }}
          animate={{
            y: "-24vh",
            x: [0, h.drift, 0],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [-8, 10, -6],
            scale: [0.72, 1, 1, 0.92],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.1, 0.88, 1],
          }}
        >
          <span className="heart-text">{h.text}</span>
          ♥
        </motion.span>
      ))}
    </div>
  );
}
