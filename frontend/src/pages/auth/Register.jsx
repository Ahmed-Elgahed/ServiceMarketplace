import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);
      alert("Account created ✅");
      navigate("/login");
    } catch {
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border rounded-lg w-full max-w-sm">
        <h1 className="text-3xl font-serif italic mb-6 text-center">
          Proly Connect
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 border p-2 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 border p-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}