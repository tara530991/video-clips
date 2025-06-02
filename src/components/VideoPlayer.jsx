import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayIcon from "../assets/svg/PlayIcon";
import PauseIcon from "../assets/svg/PauseIcon";
import RewindIcon from "../assets/svg/RewindIcon";
import ForwardIcon from "../assets/svg/ForwardIcon";

const mockChapters = [
  {
    chapter: "開場",
    subtitles: [
      {
        start: 0,
        duration: 3,
        text: "開場介紹：歡迎收看本產品演示。",
        highlight: false,
      },
      {
        start: 3,
        duration: 3,
        text: "精彩片段：產品創新亮點。",
        highlight: true,
      },
    ],
  },
  {
    chapter: "功能說明",
    subtitles: [
      {
        start: 6,
        duration: 3,
        text: "功能說明：操作簡單易懂。",
        highlight: false,
      },
      {
        start: 9,
        duration: 3,
        text: "精彩片段：高效節省時間。",
        highlight: true,
      },
    ],
  },
  {
    chapter: "結語",
    subtitles: [
      {
        start: 12,
        duration: 3,
        text: "結語：感謝您的觀看。",
        highlight: false,
      },
    ],
  },
];

// 攤平成單一陣列供時間軸與播放互動用
const flatSubtitles = mockChapters.flatMap((ch) => ch.subtitles);

const formatTime = (sec) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
};

const VideoPlayer = ({ videoUrl, videoName }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const handleSubtitleClick = (start) => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
      videoRef.current.play();
    }
  };

  // 計算精彩片段在時間軸上的位置與寬度
  const highlightBlocks =
    duration > 0
      ? flatSubtitles
          .filter((s) => s.highlight)
          .map((s, i) => {
            const left = `${(s.start / duration) * 100}%`;
            const width = `${(s.duration / duration) * 100}%`;
            return { left, width, start: s.start, text: s.text, key: i };
          })
      : [];

  // 目前播放位置
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 取得目前字幕
  const currentSubtitle = (() => {
    const t = currentTime;
    for (const sub of flatSubtitles) {
      if (t >= sub.start && t < sub.start + sub.duration) return sub.text;
    }
    return "";
  })();

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  // 快退/快轉功能
  const seek = (offset) => {
    if (!videoRef.current) return;
    let next = videoRef.current.currentTime + offset;
    if (next < 0) next = 0;
    if (next > duration) next = duration;
    videoRef.current.currentTime = next;
  };

  // 點擊時間軸跳播
  const handleTimelineClick = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * duration;
    videoRef.current.currentTime = seekTime;
  };

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">影片播放</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary-dark text-primary-light rounded-md hover:bg-secondary-light transition-colors"
          >
            返回列表
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左側：字幕區域 */}
          <div className="flex-1 order-2 lg:order-1 bg-primary-light rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">字幕區域</h2>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {mockChapters.map((chapter, cidx) => (
                <div key={cidx}>
                  <div className="mb-2 text-base font-bold text-primary-dark">
                    {chapter.chapter}
                  </div>
                  <div className="space-y-2">
                    {chapter.subtitles.map((sub, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          sub.highlight &&
                          "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 font-semibold shadow"
                        }
                        hover:bg-primary hover:border-secondary hover:text-primary-light
                        `}
                        onClick={() => handleSubtitleClick(sub.start)}
                      >
                        <span className="text-xs text-secondary-light mr-2">
                          {formatTime(sub.start)}
                        </span>
                        {sub.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 右側：影片播放器 */}
          <div className="flex-1 order-1 lg:order-2 bg-primary-light rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-xl font-bold text-secondary mb-4">
              影片播放器
            </h2>
            <div className="relative w-full">
              <p className="mb-4 text-secondary font-medium">{videoName}</p>
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                src={videoUrl}
                autoPlay
              />
              {/* 浮水印字幕 */}
              {currentSubtitle && (
                <div className="absolute left-1/2 bottom-6 -translate-x-1/2 bg-black/60 text-white text-lg px-2 py-1 shadow-lg pointer-events-none select-none max-w-[90%] text-center">
                  {currentSubtitle}
                </div>
              )}
            </div>
            {/* 自訂播放/暫停按鈕 */}
            <div className="flex items-center gap-4 mt-2">
              {/* 快退5秒 */}
              <button
                onClick={() => seek(-5)}
                className="p-2 text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors flex items-center justify-center"
                aria-label="快退5秒"
              >
                <RewindIcon />
              </button>
              {/* 播放/暫停 */}
              <button
                onClick={handlePlayPause}
                className="px-6 py-2 text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors font-bold text-lg flex items-center justify-center"
                aria-label={isPlaying ? "暫停" : "播放"}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              {/* 快轉5秒 */}
              <button
                onClick={() => seek(5)}
                className="p-2  text-primary-dark rounded-md hover:bg-secondary-light hover:text-primary-light transition-colors flex items-center justify-center"
                aria-label="快轉5秒"
              >
                <ForwardIcon />
              </button>
              {/* 時間資訊 */}
              <span className="ml-4 text-secondary-light text-sm tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            {/* 時間軸 */}
            <div className="relative w-full mt-4 h-5 flex items-center">
              {/* 主時間軸 */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-gray-200 rounded-md cursor-pointer"
                onClick={handleTimelineClick}
              />
              {/* 精彩片段區塊 */}
              {highlightBlocks.map((block) => (
                <div
                  key={block.key}
                  title={block.text}
                  className="absolute top-1/2 -translate-y-1/2 h-5 bg-yellow-200 rounded-md cursor-pointer shadow"
                  style={{ left: block.left, width: block.width, zIndex: 2 }}
                  onClick={() => handleSubtitleClick(block.start)}
                />
              ))}
              {/* 播放進度圓點 */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-secondary-light border-2 border-white rounded-full shadow transition-all"
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
