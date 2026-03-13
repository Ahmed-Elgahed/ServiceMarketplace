import { useState } from "react";

export default function EditProfile() {
  const [name, setName] = useState("Ahmed");
  const [bio, setBio] = useState("Proly Connect User");

  const handleSave = () => {
    alert("Profile updated ✅");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 border rounded-lg p-2"
      />

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full mb-4 border rounded-lg p-2"
      />

      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-3 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
}