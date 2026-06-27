import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import FloatingHearts from "./FloatingHearts";
import PhotoCard from "./PhotoCard";
import UploadModal from "./UploadModal";
import Lightbox from "./Lightbox";
import {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
  updateCaption,
} from "../firebase/photoService";
import "../styles/Gallery.css";

export default function Gallery() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isOwner = !!user; // true only when logged in — gates all write actions

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (err) {
      console.error(err);
      setLoadError("Couldn't load your memories right now. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleUpload = async (file, caption) => {
    await uploadPhoto(file, caption);
    await loadPhotos();
  };

  const handleDelete = async (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId)); // optimistic
    try {
      await deletePhoto(photoId);
    } catch (err) {
      console.error(err);
      loadPhotos(); // revert on failure
    }
  };

  const handleEditCaption = async (photoId, newCaption) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: newCaption } : p))
    );
    try {
      await updateCaption(photoId, newCaption);
    } catch (err) {
      console.error(err);
      loadPhotos();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="gallery-page">
      <FloatingHearts density={12} />

      <header className="gallery-header">
        <button className="gallery-back" onClick={() => navigate("/")} aria-label="Back to landing">
          ←
        </button>
        <h1 className="gallery-title">Us, in pictures</h1>

        {isOwner ? (
          <div className="gallery-owner-actions">
            <button className="gallery-add-btn" onClick={() => setUploadOpen(true)}>
              + Add memory
            </button>
            <button className="gallery-signout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        ) : (
          // Small, unobtrusive sign-in link — visible but not pushed on visitors.
          <button className="gallery-signin-link" onClick={() => navigate("/login")}>
            Sign in
          </button>
        )}
      </header>

      <main className="gallery-main">
        {loading && <p className="gallery-status">Gathering your memories...</p>}

        {!loading && loadError && <p className="gallery-status error">{loadError}</p>}

        {!loading && !loadError && photos.length === 0 && (
          <div className="gallery-empty">
            <span className="gallery-empty-heart">♡</span>
            <p>No memories yet{isOwner ? ". Add the first one." : " yet."}</p>
          </div>
        )}

        {!loading && !loadError && photos.length > 0 && (
          <div className="gallery-grid">
            <AnimatePresence>
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isOwner={isOwner}
                  onDelete={handleDelete}
                  onEditCaption={handleEditCaption}
                  onOpenLightbox={setLightboxPhoto}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {isOwner && (
        <UploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}

      <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
}
