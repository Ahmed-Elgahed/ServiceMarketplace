import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ✅ Main Pages
import Feed from "./pages/Feed/Feed";
import Explore from "./pages/explore/Explore";
import CreatePost from "./pages/create/CreatePost";
import Messages from "./pages/messages/Messages";
import Chat from "./pages/messages/Chat";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Followers from "./pages/Profile/Followers";
import Following from "./pages/Profile/Following";
import SavedPosts from "./pages/Profile/SavedPosts";

// ✅ Post
import PostDetails from "./pages/Feed/PostDetails";
import HashtagPage from "./pages/explore/HashtagPage";

// ✅ Payment
import PaymentHome from "./pages/payment/PaymentHome";
import SendMoney from "./pages/payment/SendMoney";
import TransactionSuccess from "./pages/payment/TransactionSuccess";

// ✅ Admin
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import AdminPanel from "./pages/admin/AdminPanel";

// ✅ Protected Route
import ProtectedRoute from "./components/ui/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected */}
        <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/:username/followers" element={<ProtectedRoute><Followers /></ProtectedRoute>} />
        <Route path="/:username/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
        <Route path="/tag/:tag" element={<ProtectedRoute><HashtagPage /></ProtectedRoute>} />

        {/* ✅ Payment */}
        <Route path="/payment" element={<ProtectedRoute><PaymentHome /></ProtectedRoute>} />
        <Route path="/send-money" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><TransactionSuccess /></ProtectedRoute>} />

        {/* ✅ Admin */}
        <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;