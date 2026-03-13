import { useState } from "react";
import { searchUsers } from "../../services/api";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const data = await searchUsers(value);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="w-full border rounded-lg p-2 mb-4"
      />

      {results.map((user) => (
        <div key={user.id} className="mb-3">
          <span className="font-semibold">{user.username}</span>
        </div>
      ))}
    </div>
  );
}