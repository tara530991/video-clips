import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";

const PlayerPage = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const videoData = localStorage.getItem("currentVideo");
    if (videoData) {
      setCurrentVideo(JSON.parse(videoData));
    } else {
      // 如果沒有影片數據，返回主頁
      navigate("/");
    }
  }, [navigate]);

  if (!currentVideo) {
    return null;
  }

  return (
    <VideoPlayer videoUrl={currentVideo.url} videoName={currentVideo.name} />
  );
};

export default PlayerPage;
