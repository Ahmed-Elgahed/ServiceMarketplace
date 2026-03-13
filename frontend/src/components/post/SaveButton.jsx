import { useState } from "react";
import { Bookmark } from "lucide-react";

export default function SaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <Bookmark
      onClick={() => setSaved(!saved)}
      size={24}
      className={`cursor-pointer ${
        saved ? "fill-black text-black" : "text-black"
      }`}
    />
  );
}