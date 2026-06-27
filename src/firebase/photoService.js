import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { uploadToCloudinary } from "./cloudinary";

const PHOTOS_COLLECTION = "photos";

/**
 * Upload a photo to Cloudinary, then save its metadata
 * (image URL, public id, caption) to Firestore.
 */
export async function uploadPhoto(file, caption) {
  // 1. Upload the raw file to Cloudinary (unsigned preset, no secret needed)
  const { imageUrl, publicId } = await uploadToCloudinary(file);

  // 2. Save metadata to Firestore so the gallery can list it
  const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), {
    imageUrl,
    publicId, // kept for reference; not used for deletion from the client
    caption: caption || "",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Fetch all photos, newest first.
 */
export async function fetchPhotos() {
  const q = query(collection(db, PHOTOS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update just the caption of an existing photo.
 */
export async function updateCaption(photoId, newCaption) {
  const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoRef, { caption: newCaption });
}

/**
 * Delete a photo's record from Firestore, so it disappears from the
 * gallery immediately.
 *
 * NOTE: This does NOT delete the underlying file from Cloudinary.
 * Unsigned uploads (the no-backend approach we're using) can't delete
 * files from the browser — Cloudinary requires a signed request with
 * your API secret for that, which means a small server. Since we're
 * keeping this fully frontend-only, removed photos just stay
 * unreferenced on Cloudinary's free tier (25GB+), which is plenty of
 * headroom for a personal gallery like this.
 */
export async function deletePhoto(photoId) {
  await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
}
