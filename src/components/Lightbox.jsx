import { motion, AnimatePresence } from "framer-motion";
import "../styles/Lightbox.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { scale: 0.88, opacity: 0, y: 24 },
  visible: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.95, opacity: 0, y: 16 },
};

export default function Lightbox({ photo, onClose }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="lightbox-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.28, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.button
            className="lightbox-close"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.22 }}
            aria-label="Close photo view"
          >
            ✕
          </motion.button>

          <motion.div
            className="lightbox-content"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={photo.imageUrl}
              alt={photo.caption || "A memory of us"}
              initial={{ y: 18, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
            {photo.caption && (
              <motion.p
                className="lightbox-caption"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.24, delay: 0.1 }}
              >
                {photo.caption}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
