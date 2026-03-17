import StoryCircle from "../components/StoryCircle";
import PostCard from "../components/PostCard";

export default function Home() {
  return (
    <div className="pt-20 pb-20 max-w-md mx-auto">
      
      <div className="flex gap-4 overflow-x-auto px-3 mb-6">
        {[1,2,3,4,5].map(i => (
          <StoryCircle 
            key={i}
            img={`https://i.pravatar.cc/150?u=${i}`}
            name={`user_${i}`}
          />
        ))}
      </div>

      {[1,2].map(i => (
        <PostCard
          key={i}
          post={{
            username: "ahmed",
            avatar: "https://i.pravatar.cc/300?u=me",
            image: "https://images.unsplash.com/photo-1593642531955-38e030080aa8",
            likes: 200 + i,
            caption: "أحلى يوم!",
          }}
        />
      ))}

    </div>
  );
}