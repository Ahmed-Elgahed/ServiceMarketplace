import { useEffect, useState, useRef } from "react";

const STORY_DURATION = 5000; // 5 seconds

export default function StoryViewer({
  stories = [],
  currentIndex = 0,
  nextStory,
}) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const isMounted = useRef(true);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;

    setProgress(0);
    isMounted.current = true;

    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = (elapsed / STORY_DURATION) * 100;

      if (percentage >= 100) {
        clearInterval(timerRef.current);

        if (isMounted.current) {
          setProgress(100);
        }

        if (typeof nextStory === "function") {
          nextStory();
        }

      } else {
        if (isMounted.current) {
          setProgress(percentage);
        }
      }
    }, 50);

    return () => {
      isMounted.current = false;
      clearInterval(timerRef.current);
    };
  }, [currentIndex, currentStory, nextStory]);

  // ✅ لو مفيش قصة
  if (!currentStory) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white">
        No story available
      </div>
    );
  }

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
        src={currentStory.image}
        alt="story"
        className="max-h-full object-contain"
      />

    </div>
  );
}