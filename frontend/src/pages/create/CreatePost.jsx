import { useState } from "react";
import { createPost } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ضغط الصورة
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 1080;
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.7
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // ✅ اختيار الصورة
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ نشر البوست
  const handlePost = async () => {
    if (!imageFile) return alert("Upload image first");

    try {
      setLoading(true);

      const compressedImage = await compressImage(imageFile);

      await createPost(compressedImage, caption);

      navigate("/");
    } catch (err) {
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-14 pb-16 px-4 transition-colors">
      <div className="max-w-md mx-auto">

        {/* Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full text-sm"
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full mt-4 rounded-lg aspect-square object-cover"
          />
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full mt-4 border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write caption..."
          rows={3}
        />

        {/* Button */}
        <button
          onClick={handlePost}
          disabled={loading}
          className={`w-full py-3 rounded-lg mt-4 text-white transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Posting..." : "Share"}
        </button>

      </div>
    </div>
  );
}