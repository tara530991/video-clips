import React, { useRef, useState, useEffect } from "react";
import { formatTime } from "../utils/formatTime";

const HighlightPlayer = ({ videoUrl, highlights, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 當精彩片段改變時，更新視頻源
  useEffect(() => {
    if (!highlights.length || !videoRef.current) return;

    const currentHighlight = highlights[currentHighlightIndex];
    if (currentHighlight) {
      videoRef.current.currentTime = currentHighlight.start_time;
    }
  }, [highlights, currentHighlightIndex]);

  // 監聽視頻播放進度
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !highlights.length) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentHighlight = highlights[currentHighlightIndex];

      // 如果當前時間超過當前高亮片段的結束時間，切換到下一個片段
      if (
        currentTime >=
        currentHighlight.start_time + currentHighlight.duration
      ) {
        if (currentHighlightIndex < highlights.length - 1) {
          setCurrentHighlightIndex((prev) => prev + 1);
        } else {
          // 如果是最後一個片段，停止播放
          video.pause();
          setIsPlaying(false);
        }
      }

      // 通知父組件當前播放時間
      if (onTimeUpdate) {
        onTimeUpdate(currentTime);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [highlights, currentHighlightIndex, onTimeUpdate]);

  // 播放/暫停控制
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 切換到上一個/下一個精彩片段
  const handleSeekHighlight = (direction) => {
    if (!highlights.length) return;

    const newIndex = currentHighlightIndex + direction;
    if (newIndex >= 0 && newIndex < highlights.length) {
      setCurrentHighlightIndex(newIndex);
      if (videoRef.current) {
        videoRef.current.currentTime = highlights[newIndex].start_time;
      }
    }
  };

  return (
    <div className="">
      <video
        ref={videoRef}
        className="rounded-lg"
        src={videoUrl}
        controls={false}
      />

      {/* 自定義控制欄 */}
      <div className="bg-black/50 p-3 flex items-center justify-center gap-4">
        <button
          onClick={() => handleSeekHighlight(-1)}
          className="p-2 text-white rounded-md hover:bg-white/20 transition-colors"
          disabled={currentHighlightIndex === 0}
        >
          上一個片段
        </button>

        <button
          onClick={handlePlayPause}
          className="px-6 py-2 text-white rounded-md hover:bg-white/20 transition-colors"
        >
          {isPlaying ? "暫停" : "播放"}
        </button>

        <button
          onClick={() => handleSeekHighlight(1)}
          className="p-2 text-white rounded-md hover:bg-white/20 transition-colors"
          disabled={currentHighlightIndex === highlights.length - 1}
        >
          下一個片段
        </button>
      </div>
    </div>
  );
};

export default HighlightPlayer;
