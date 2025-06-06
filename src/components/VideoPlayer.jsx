import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import PlayIcon from "../assets/svg/PlayIcon";
import PauseIcon from "../assets/svg/PauseIcon";
import RewindIcon from "../assets/svg/RewindIcon";
import ForwardIcon from "../assets/svg/ForwardIcon";
import { formatTime } from "../utils/formatTime";
import { useTranscript } from "../hooks/useTranscript";
import HighlightPlayer from "./HighlightPlayer";

const VideoPlayer = ({ videoUrl, videoName }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'highlights' | 'selected'
  const [isFetchData, setFetchData] = useState(true); // true to enable useTranscript call
  const subtitleContainerRef = useRef(null);

  const { data, isLoading, error } = useTranscript({
    duration,
    isFetchData,
  });

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => setDuration(video.duration || 0);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Handle subtitle updates
  useEffect(() => {
    if (!data) return;
    if (isFetchData && data) {
      setFetchData(false);
    }

    const flatSubtitles = data.flatMap((ch) => ch.sentences);
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const currentSubtitle = (() => {
      const t = currentTime;
      for (const sub of flatSubtitles) {
        if (t >= sub.start_time && t < sub.start_time + sub.duration)
          return sub.text;
      }
      return "";
    })();

    if (selectedHighlights.length === 0 && viewMode === "highlights") {
      setCurrentSubtitle("");
      setProgress(0);
    } else {
      setCurrentSubtitle(currentSubtitle);
      setProgress(progress);
    }
  }, [data, duration, currentTime, isPlaying]);

  // Handle highlight selection
  const handleHighlightToggle = useCallback((sentence) => {
    setSelectedHighlights((prev) => {
      const isSelected = prev.some((h) => h.start_time === sentence.start_time);
      if (isSelected) {
        return prev.filter((h) => h.start_time !== sentence.start_time);
      } else {
        return [...prev, sentence].sort((a, b) => a.start_time - b.start_time);
      }
    });
  }, []);

  // Handle playback control
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  // Fast forward/rewind functionality
  const seek = useCallback(
    (offset) => {
      if (!videoRef.current) return;
      let next = videoRef.current.currentTime + offset;
      if (next < 0) next = 0;
      if (next > duration) next = duration;
      videoRef.current.currentTime = next;
    },
    [duration]
  );

  // Handle timeline click
  const handleTimelineClick = useCallback(
    (e) => {
      if (!videoRef.current || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      const seekTime = percent * duration;
      videoRef.current.currentTime = seekTime;
    },
    [duration]
  );

  // Handle subtitle click
  const handleSubtitleClick = useCallback((start) => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
      videoRef.current.play();
    }
  }, []);

  // Handle highlight player time update
  const handleHighlightTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      setProgress((time / duration) * 100);
    },
    [duration]
  );

  // Filter displayed subtitles
  const filteredData = useMemo(() => {
    if (!data) return [];

    if (viewMode === "all") return data;

    return data
      .map((chapter) => ({
        ...chapter,
        sentences: chapter.sentences.filter((sentence) =>
          selectedHighlights.some((h) => h.start_time === sentence.start_time)
        ),
      }))
      .filter((chapter) => chapter.sentences.length > 0);
  }, [data, viewMode, selectedHighlights]);

  // Calculate highlight blocks
  const highlightBlocks = useMemo(() => {
    if (!data || !duration) return [];

    const flatSubtitles = data.flatMap((ch) => ch.sentences);

    // In highlights mode only show selected highlights
    const blocks =
      viewMode === "highlights"
        ? selectedHighlights
        : flatSubtitles.filter(
            (s) =>
              s.highlight ||
              selectedHighlights.some((h) => h.start_time === s.start_time)
          );

    return blocks.map((s, i) => {
      const left = `${(s.start_time / duration) * 100}%`;
      const width = `${(s.duration / duration) * 100}%`;
      return { left, width, start: s.start_time, text: s.text, key: i };
    });
  }, [data, duration, selectedHighlights, viewMode]);

  // Calculate next highlight time
  const getNextHighlightTime = useCallback(
    (currentTime) => {
      if (viewMode !== "highlights" || !selectedHighlights.length) return null;

      // Find next highlight
      const nextHighlight = selectedHighlights.find(
        (h) => h.start_time > currentTime
      );

      // If no next highlight found (current at last highlight), return first highlight
      if (!nextHighlight) {
        return selectedHighlights[0].start_time;
      }

      return selectedHighlights.length === 0 ? null : nextHighlight.start_time;
    },
    [viewMode, selectedHighlights]
  );

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    if (viewMode === "highlights") {
      const nextTime = getNextHighlightTime(currentTime);
      if (nextTime !== null && videoRef.current) {
        videoRef.current.currentTime = nextTime;
        videoRef.current.play();
      }
    }
  }, [viewMode, currentTime, getNextHighlightTime]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (viewMode === "highlights" && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const currentHighlight = selectedHighlights.find(
        (h) =>
          currentTime >= h.start_time && currentTime < h.start_time + h.duration
      );

      // If current time not in any highlight, jump to next highlight
      if (!currentHighlight && selectedHighlights.length > 0) {
        const nextTime = getNextHighlightTime(currentTime);

        if (nextTime !== null) {
          videoRef.current.currentTime = nextTime;
          videoRef.current.play();
        }
      } else if (selectedHighlights.length === 0) {
        videoRef.current.play();
      }
    }
  }, [viewMode, selectedHighlights, getNextHighlightTime]);

  // Add time update event listener to video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [handleTimeUpdate]);

  // Add video ended event listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("ended", handleVideoEnded);
    return () => {
      video.removeEventListener("ended", handleVideoEnded);
    };
  }, [handleVideoEnded]);

  // Handle mode change
  const handleModeChange = useCallback(
    (mode) => {
      // If highlights mode has no selected highlights, do not switch mode
      if (mode === "highlights" && selectedHighlights.length === 0) return;

      setViewMode(mode);
      if (
        mode === "highlights" &&
        selectedHighlights.length > 0 &&
        videoRef.current
      ) {
        // Switch to highlights mode, jump to first highlights
        videoRef.current.currentTime = selectedHighlights[0].start_time;
        videoRef.current.play();
      }
    },
    [selectedHighlights]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary p-8 flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary p-8 flex items-center justify-center">
        <div className="text-error">Loading failed: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Video Player</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary-dark text-primary-light rounded-md hover:bg-secondary-light transition-colors"
          >
            Return to List
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: subtitle area */}
          <div className="flex-1 order-2 lg:order-1 bg-primary-light rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">
                Subtitle Area
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModeChange("all")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === "all"
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Mode
                </button>
                <button
                  onClick={() => handleModeChange("highlights")}
                  className={`px-4 py-2 rounded-md transition-colors
                    ${
                      selectedHighlights.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                    viewMode === "highlights"
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Highlights Mode
                </button>
              </div>
            </div>
            <div
              ref={subtitleContainerRef}
              className="space-y-4 max-h-[60vh] overflow-y-auto"
            >
              {!data ? (
                <div>
                  <div className="mb-2 text-base font-bold text-primary-dark">
                    Loading
                  </div>
                </div>
              ) : (
                filteredData.map((chapter, cidx) => (
                  <div key={cidx}>
                    <div className="mb-2 text-base font-bold text-primary-dark">
                      {chapter.chapter}
                    </div>
                    <div className="space-y-2">
                      {chapter.sentences.map((sub, idx) => {
                        const isSelected = selectedHighlights.some(
                          (h) => h.start_time === sub.start_time
                        );
                        const isHighlighted = sub.highlight || isSelected;
                        const isActive =
                          currentTime >= sub.start_time &&
                          currentTime < sub.start_time + sub.duration;

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-md cursor-pointer transition-all
                              ${
                                isHighlighted
                                  ? "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 font-semibold shadow"
                                  : ""
                              }
                              ${isActive ? "active-subtitle bg-primary/20" : ""}
                              hover:bg-primary hover:border-secondary hover:text-primary-light
                            `}
                            onClick={() => handleHighlightToggle(sub)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-secondary-light mr-2">
                                {formatTime(sub.start_time)}
                              </span>
                              <button
                                className={`w-4 h-4 rounded-full border-2 
                                  ${
                                    isSelected
                                      ? "bg-yellow-500 border-yellow-600"
                                      : "border-gray-300"
                                  }
                                `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHighlightToggle(sub);
                                }}
                              />
                            </div>
                            {sub.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Right side: video player */}
          <div className="flex-1 order-1 lg:order-2 bg-primary-light rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-xl font-bold text-secondary mb-4">
              {viewMode === "highlights"
                ? "Highlights Preview"
                : "Original Video"}
            </h2>
            <div className="relative w-full">
              <p className="mb-4 text-secondary font-medium">{videoName}</p>

              <video
                ref={videoRef}
                className="w-full rounded-lg"
                src={videoUrl}
                autoPlay
              />

              {/* Watermark subtitle */}
              {currentSubtitle && (
                <div className="absolute left-1/2 bottom-6 -translate-x-1/2 bg-black/60 text-white text-lg px-2 py-1 shadow-lg pointer-events-none select-none max-w-[90%] text-center">
                  {currentSubtitle}
                </div>
              )}
            </div>
            {/* Custom play/pause button */}
            <div className="flex items-center gap-4 mt-2">
              {/* Fast backward 5 seconds */}
              <button
                onClick={() => seek(-5)}
                className="p-2 text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors flex items-center justify-center"
                aria-label="Fast backward 5 seconds"
              >
                <RewindIcon />
              </button>
              {/* Play/pause */}
              <button
                onClick={handlePlayPause}
                className="px-6 py-2 text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors font-bold text-lg flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              {/* Fast forward 5 seconds */}
              <button
                onClick={() => seek(5)}
                className="p-2 text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors flex items-center justify-center"
                aria-label="Fast forward 5 seconds"
              >
                <ForwardIcon />
              </button>
              {/* Time information */}
              <span className="ml-4 text-secondary-light text-sm tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            {/* Timeline */}
            <div className="relative w-full mt-4 h-5 flex items-center">
              {/* Main timeline */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-gray-200 rounded-md cursor-pointer"
                onClick={handleTimelineClick}
              />
              {/* Highlight blocks */}
              {highlightBlocks.map((block, i) => (
                <div
                  key={i}
                  title={block.text}
                  className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-md cursor-pointer shadow ${
                    viewMode === "highlights"
                      ? "bg-yellow-500"
                      : "bg-yellow-200"
                  }`}
                  style={{
                    left: block.left,
                    width: block.width,
                    zIndex: 2,
                  }}
                  onClick={() => handleSubtitleClick(block.start)}
                />
              ))}
              {/* Current playback progress point */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-secondary-light border-2 border-white rounded-md shadow transition-all"
                style={{ left: `calc(${progress}% - 0.5rem)`, zIndex: 3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
