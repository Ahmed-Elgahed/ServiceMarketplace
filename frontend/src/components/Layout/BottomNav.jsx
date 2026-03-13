import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "text-black" : "text-gray-400";

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50">
      
      <Link to="/">
        <Home size={26} className={active("/")} />
      </Link>

      <Link to="/explore">
        <Search size={26} className={active("/explore")} />
      </Link>

      <Link to="/create">
        <PlusSquare size={26} className={active("/create")} />
      </Link>

      <Link to="/payment">
        <Film size={26} className={active("/payment")} />
      </Link>

      <Link to="/profile/me">
        <User size={26} className={active("/profile/me")} />
      </Link>

    </div>
  );
}