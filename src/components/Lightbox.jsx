import { motion, AnimatePresence } from "framer-motion";
import "../styles/Lightbox.css";

export default function Lightbox({ photo, onClose }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.button
            className="lightbox-close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Close photo view"
          >
            ✕
          </motion.button>

          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photo.imageUrl} alt={photo.caption || "A memory of us"} />
            {photo.caption && <p className="lightbox-caption">{photo.caption}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
