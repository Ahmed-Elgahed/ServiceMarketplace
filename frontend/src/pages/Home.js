import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  PlusSquare, Search, Home as HomeIcon, Compass, User,
  Play, Star, ShieldCheck, MapPin, Phone
} from 'lucide-react';

// --- مكون البوست الاحترافي (Instagram Post Component) ---
const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  return (
    <div className="bg-white border border-gray-300 rounded-lg mb-6 w-full max-w-[600px] mx-auto shadow-sm">
      {/* رأس البوست (Header) */}
      <div className="flex items-center justify-between p-3 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
            <img src={post.userAvatar} className="w-full h-full rounded-full border-2 border-white object-cover" alt="" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm hover:underline cursor-pointer">{post.username}</span>
              {post.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500" />}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {post.location} • {post.specialty}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-black transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* صورة/فيديو البوست */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden group">
        <img src={post.postImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
        {post.type === 'reel' && (
          <div className="absolute top-4 right-4">
            <Play className="w-6 h-6 text-white fill-white shadow-lg" />
          </div>
        )}
      </div>

      {/* أزرار التفاعل */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <Heart 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-7 h-7 cursor-pointer transition-all ${isLiked ? 'text-red-500 fill-red-500 scale-125' : 'text-gray-700 hover:text-gray-400'}`} 
            />
            <MessageCircle className="w-7 h-7 text-gray-700 hover:text-gray-400 cursor-pointer" />
            <Send className="w-7 h-7 text-gray-700 hover:text-gray-400 cursor-pointer" />
          </div>
          <Bookmark className="w-7 h-7 text-gray-700 hover:text-gray-400 cursor-pointer" />
        </div>

        {/* تفاصيل البوست */}
        <div className="space-y-1">
          <p className="font-bold text-sm">{post.likes.toLocaleString()} إعجاب</p>
          <div className="text-sm">
            <span className="font-bold ml-2">{post.username}</span>
            <span className="text-gray-800">{post.caption}</span>
          </div>
          <p className="text-gray-400 text-xs mt-2 cursor-pointer">مشاهدة جميع التعليقات ({post.commentsCount})</p>
          <p className="text-gray-400 text-[10px] mt-1 uppercase font-semibold">{post.timeAgo}</p>
        </div>
      </div>

      {/* قسم الاتصال المدمج (Hidden Phone Logic) */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-800">01x xxxx xxxx</span>
        </div>
        <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md">
            طلب خدمة (الرقم يظهر هنا)
        </button>
      </div>

      {/* إضافة تعليق */}
      <div className="border-t border-gray-100 p-3 flex items-center gap-3">
        <input 
          type="text" 
          placeholder="إضافة تعليق..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
        />
        <button className="text-blue-500 font-bold text-sm hover:text-blue-700 disabled:opacity-50">نشر</button>
      </div>
    </div>
  );
};

// --- المكون الرئيسي للهوم (Home Page Master) ---
const Home = () => {
  const [stories, setStories] = useState([
    { id: 1, name: 'محمود سباك', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'أحمد نقاش', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'سيد نجار', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'علي كهربائي', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'مصطفى تبريد', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'هاني رخام', avatar: 'https://i.pravatar.cc/150?u=6' },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'ahmed_elgahed',
      userAvatar: 'https://i.pravatar.cc/150?u=a',
      location: 'التجمع الخامس، القاهرة',
      specialty: 'مهندس ديكور',
      postImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
      caption: 'تم الانتهاء من تصميم وتنفيذ ديكورات شقة بالكامل.. رأيكم يهمني!',
      likes: 4520,
      commentsCount: 120,
      timeAgo: 'منذ ساعتين',
      isVerified: true,
      type: 'post'
    },
    {
      id: 2,
      username: 'mohamed_electric',
      userAvatar: 'https://i.pravatar.cc/150?u=m',
      location: 'الشيخ زايد',
      specialty: 'كهربائي فني',
      postImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
      caption: 'تأسيس سمارت هوم بأحدث الأنظمة العالمية.. جودة وأمان.',
      likes: 890,
      commentsCount: 45,
      timeAgo: 'منذ 5 ساعات',
      isVerified: false,
      type: 'reel'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. الناف بار العلوي (Instagram Navbar) */}
      <nav className="h-16 bg-white border-b border-gray-300 fixed top-0 w-full z-50 flex justify-center px-4">
        <div className="max-w-5xl w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent italic tracking-tighter cursor-pointer">
            PROLY CONNECT
          </h1>
          
          <div className="hidden md:flex relative group">
            <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="ابحث عن صنايعي أو خدمة..." 
              className="bg-gray-100 border-none rounded-lg py-2 pr-10 pl-4 w-72 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <HomeIcon className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform hidden sm:block" />
            <MessageCircle className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
            <PlusSquare className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
            <div className="w-7 h-7 rounded-full bg-gray-200 border border-gray-300 overflow-hidden cursor-pointer">
              <img src="https://i.pravatar.cc/150?u=me" alt="profile" />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. المحتوى الرئيسي (Main Content) */}
      <main className="flex-1 mt-20 max-w-5xl mx-auto w-full flex justify-center gap-8 px-4">
        
        {/* قسم التغذية (Feed Section) */}
        <div className="w-full lg:w-[600px]">
          
          {/* الاستوريز (Stories) */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6 flex gap-4 overflow-x-auto scrollbar-hide shadow-sm">
            {stories.map(story => (
              <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] transition-transform active:scale-90">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img src={story.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <span className="text-[10px] w-16 truncate text-center font-medium">{story.name}</span>
              </div>
            ))}
          </div>

          {/* البوستات (Posts Feed) */}
          <div className="flex flex-col gap-2">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </div>

        {/* 3. الجانب الأيمن (Sidebar Suggestions) */}
        <div className="hidden lg:block w-80 sticky top-24 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/150?u=me" className="w-14 h-14 rounded-full border border-gray-200" alt="" />
              <div>
                <p className="font-bold text-sm">elgahed_user</p>
                <p className="text-gray-500 text-sm">أحمد محمد (عميل)</p>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-bold hover:text-black">تبديل</button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold text-sm">مقترح لك</span>
            <button className="text-xs font-bold hover:text-gray-400">عرض الكل</button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-8 h-8 rounded-full" alt="" />
                  <div>
                    <p className="font-bold text-sm group-hover:underline">Worker_Name_{i}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                        <span>4.8 • نجار موبيليا</span>
                    </div>
                  </div>
                </div>
                <button className="text-blue-500 text-xs font-bold">متابعة</button>
              </div>
            ))}
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-[11px] text-gray-300 space-y-4 uppercase tracking-wider">
            <p className="hover:underline cursor-pointer">معلومات • مساعدة • الصحافة • API • الوظائف • الخصوصية</p>
            <p className="text-gray-400 font-bold mt-4">© 2026 PROLY CONNECT FROM ELGAHED</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;