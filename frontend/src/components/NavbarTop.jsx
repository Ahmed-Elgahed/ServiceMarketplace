import { Heart, MessageCircle, Bell } from "lucide-react";

export default function NavbarTop() {
  return (
    <div className="fixed top-0 w-full bg-white z-50 border-b flex items-center justify-between px-4 py-3">
      <img 
        src="/logo.png" 
        alt="Proly Connect" 
        className="w-28"
      />
      
      <div className="flex gap-6">
        <Bell className="w-6 h-6 cursor-pointer" />
        <Heart className="w-6 h-6 cursor-pointer" />
        <MessageCircle className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
}