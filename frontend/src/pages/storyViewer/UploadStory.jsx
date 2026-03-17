import { useState } from "react";
import { uploadStory } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function UploadStory() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    try {
      await uploadStory(file);
      navigate("/");
    } catch {
      alert("Story upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleUpload}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Upload Story
      </button>
    </div>
  );
}