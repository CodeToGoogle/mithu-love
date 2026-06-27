import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import "../styles/Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <FloatingHearts density={14} />

      <div className="landing-content">
        <motion.p
          className="landing-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          for the one who makes everything softer
        </motion.p>

        <motion.button
          className="love-seal"
          onClick={() => navigate("/home")}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: [1, 1.035, 1],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.2 },
            scale: {
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Enter the gallery for Mithu"
        >
          <span className="love-seal-ring" />
          <span className="love-seal-text">
            I Love You
            <span className="love-seal-name">Mithu</span>
          </span>
        </motion.button>

        <motion.p
          className="landing-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          tap the heart, love
        </motion.p>
      </div>
    </div>
  );
}
