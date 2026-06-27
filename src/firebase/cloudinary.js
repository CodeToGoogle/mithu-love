// Cloudinary config — only the cloud name and unsigned preset are needed
// in frontend code. NEVER put your API secret here; unsigned uploads
// don't require it, which is exactly why we use this approach.
const CLOUD_NAME = "dyitn40fy";
const UPLOAD_PRESET = "Mithu-Love";

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload an image file straight from the browser to Cloudinary using
 * an unsigned upload preset. Returns the secure (https) URL Cloudinary
 * gives back, which is what we save into Firestore.
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${response.status} ${errBody}`);
  }

  const data = await response.json();
  // data.secure_url -> hosted image URL
  // data.public_id  -> Cloudinary's internal id (kept in case we ever
  //                    want signed deletion via a backend later)
  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  };
}
