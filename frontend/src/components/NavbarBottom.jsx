import { Home, Search, PlusSquare, Play, User } from "lucide-react";

export default function NavbarBottom({ active, setActive }) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex items-center justify-around py-2">
      <Home onClick={() => setActive("home")} className={icon(active,"home")} />
      <Search onClick={() => setActive("search")} className={icon(active,"search")} />
      <PlusSquare onClick={() => setActive("upload")} className={icon(active,"upload")} />
      <Play onClick={() => setActive("reels")} className={icon(active,"reels")} />
      <User onClick={() => setActive("profile")} className={icon(active,"profile")} />
    </div>
  );
}

const icon = (a, b) => `w-7 h-7 cursor-pointer ${a === b ? "text-black" : "text-gray-400"}`;