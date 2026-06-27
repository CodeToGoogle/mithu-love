import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/PhotoCard.css";

export default function PhotoCard({ photo, isOwner, onDelete, onEditCaption, onOpenLightbox }) {
  const [editing, setEditing] = useState(false);
  const [captionDraft, setCaptionDraft] = useState(photo.caption || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onEditCaption(photo.id, captionDraft);
    setSaving(false);
    setEditing(false);
  };

  return (
    <motion.div
      className="photo-card"
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div className="photo-card-image-wrap" onClick={() => onOpenLightbox(photo)}>
        <img src={photo.imageUrl} alt={photo.caption || "A memory of us"} loading="lazy" />
        <span className="photo-card-corner-heart">♥</span>
      </div>

      <div className="photo-card-footer">
        {editing && isOwner ? (
          <div className="caption-edit-row">
            <input
              type="text"
              value={captionDraft}
              onChange={(e) => setCaptionDraft(e.target.value)}
              placeholder="Write a little love note..."
              className="caption-input"
              autoFocus
            />
            <button className="caption-btn save" onClick={handleSave} disabled={saving}>
              {saving ? "..." : "Save"}
            </button>
          </div>
        ) : (
          <p
            className="photo-caption"
            onClick={() => isOwner && setEditing(true)}
            title={isOwner ? "Click to edit" : undefined}
            style={{ cursor: isOwner ? "pointer" : "default" }}
          >
            {photo.caption || (isOwner ? "Add a love note..." : "")}
          </p>
        )}

        {isOwner && (
          <button
            className="photo-delete-btn"
            onClick={() => onDelete(photo.id)}
            aria-label="Remove this photo"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}
