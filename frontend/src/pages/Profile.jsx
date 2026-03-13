import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16">

      <div className="max-w-md mx-auto px-4">

        {/* Top Section */}
        <div className="flex gap-6 items-center">

          <img
            src="https://i.pravatar.cc/150?u=me"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex-1">

            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">ahmed_user</p>

              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-gray-100 px-4 py-1.5 rounded-lg text-sm font-semibold"
              >
                Edit
              </button>
            </div>

            <div className="flex gap-6 mt-4 text-sm">

              <div className="text-center">
                <p className="font-bold">20</p>
                <p>Posts</p>
              </div>

              <div
                onClick={() => navigate("/followers")}
                className="text-center cursor-pointer"
              >
                <p className="font-bold">150</p>
                <p>Followers</p>
              </div>

              <div
                onClick={() => navigate("/following")}
                className="text-center cursor-pointer"
              >
                <p className="font-bold">120</p>
                <p>Following</p>
              </div>

            </div>

          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <p className="font-semibold text-sm">Ahmed Elgahed</p>
          <p className="text-sm text-gray-600">
            Proly Connect | Professional Services 🚀
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-10 border-t mt-6 pt-4 text-sm font-semibold">
          <span className="border-b-2 border-black pb-2">Posts</span>
          <span
            onClick={() => navigate("/saved")}
            className="text-gray-400 cursor-pointer"
          >
            Saved
          </span>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/300?random=${i}`}
              className="aspect-square object-cover rounded-sm cursor-pointer"
              onClick={() => navigate(`/post/${i}`)}
            />
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg font-semibold"
        >
          Logout
        </button>

      </div>

      <BottomNav />
    </div>
  );
}