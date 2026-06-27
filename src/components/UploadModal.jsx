import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/UploadModal.css";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Choose a photo first, love.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      await onUpload(file, caption);
      // reset + close on success
      setFile(null);
      setPreview(null);
      setCaption("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong uploading. Try again?");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setPreview(null);
    setCaption("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">Add a memory</h3>

            <label className="upload-dropzone">
              {preview ? (
                <img src={preview} alt="Selected preview" className="upload-preview" />
              ) : (
                <span className="upload-placeholder">
                  <span className="upload-icon">♡</span>
                  Tap to choose a photo
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>

            <input
              type="text"
              placeholder="Write a love note for this one..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="modal-caption-input"
            />

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleClose} disabled={uploading}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleSubmit} disabled={uploading}>
                {uploading ? "Uploading..." : "Add to gallery"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
