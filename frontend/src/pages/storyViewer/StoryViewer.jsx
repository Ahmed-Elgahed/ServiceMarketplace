import { useEffect, useState } from "react";

const STORY_DURATION = 5000; // مدة القصة 5 ثواني

export default function StoryViewer({ stories, currentIndex, nextStory }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = (elapsed / STORY_DURATION) * 100;

      if (percentage >= 100) {
        clearInterval(timer);
        setProgress(100);
        nextStory();
      } else {
        setProgress(percentage);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">

      {/* ✅ Progress Bar */}
      <div className="absolute top-3 left-3 right-3 h-1 bg-gray-600 rounded overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ✅ Story Image */}
      <img
        src={stories[currentIndex]?.image}
        alt="story"
        className="max-h-full object-contain"
      />

    </div>
  );
}