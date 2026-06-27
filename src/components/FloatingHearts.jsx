import { useMemo } from "react";
import { motion } from "framer-motion";
import "../styles/FloatingHearts.css";

/**
 * Renders a fixed full-page layer of hearts that drift upward like
 * rising embers. Sits behind page content (pointer-events: none).
 *
 * density: how many hearts to render at once
 */
export default function FloatingHearts({ density = 18 }) {
  const hearts = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const size = 14 + Math.random() * 22; // 14px - 36px
      const left = Math.random() * 100; // vw %
      const duration = 9 + Math.random() * 8; // 9s - 17s
      const delay = Math.random() * 10; // stagger starts
      const drift = (Math.random() - 0.5) * 80; // px horizontal sway
      const opacity = 0.35 + Math.random() * 0.45;
      const hue = Math.random() > 0.5 ? "var(--rose)" : "var(--petal)";
      return { id: i, size, left, duration, delay, drift, opacity, hue };
    });
  }, [density]);

  return (
    <div className="hearts-layer" aria-hidden="true">
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
          initial={{ y: "100vh", x: 0, opacity: 0, rotate: -8 }}
          animate={{
            y: "-15vh",
            x: [0, h.drift, 0],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.85, 1],
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
