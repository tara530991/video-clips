import React, { useRef, useState, useEffect } from "react";
import { formatTime } from "../utils/formatTime";

const HighlightPlayer = ({ videoUrl, highlights, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update video source when highlights change
  useEffect(() => {
    if (!highlights.length || !videoRef.current) return;

    const currentHighlight = highlights[currentHighlightIndex];
    if (currentHighlight) {
      videoRef.current.currentTime = currentHighlight.start_time;
    }
  }, [highlights, currentHighlightIndex]);

  // Monitor video playback progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !highlights.length) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentHighlight = highlights[currentHighlightIndex];

      // If current time exceeds current highlight end time, switch to next highlight
      if (
        currentTime >=
        currentHighlight.start_time + currentHighlight.duration
      ) {
        if (currentHighlightIndex < highlights.length - 1) {
          setCurrentHighlightIndex((prev) => prev + 1);
        } else {
          // If it's the last highlight, stop playback
          video.pause();
          setIsPlaying(false);
        }
      }

      // Notify parent component of current playback time
      if (onTimeUpdate) {
        onTimeUpdate(currentTime);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [highlights, currentHighlightIndex, onTimeUpdate]);

  // Play/pause control
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Switch to previous/next highlight
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

      {/* Custom control bar */}
      <div className="bg-black/50 p-3 flex items-center justify-center gap-4">
        <button
          onClick={() => handleSeekHighlight(-1)}
          className="p-2 text-white rounded-md hover:bg-white/20 transition-colors"
          disabled={currentHighlightIndex === 0}
        >
          Previous Highlight
        </button>

        <button
          onClick={handlePlayPause}
          className="px-6 py-2 text-white rounded-md hover:bg-white/20 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => handleSeekHighlight(1)}
          className="p-2 text-white rounded-md hover:bg-white/20 transition-colors"
          disabled={currentHighlightIndex === highlights.length - 1}
        >
          Next Highlight
        </button>
      </div>
    </div>
  );
};

export default HighlightPlayer;
