import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VideoCard from "./VideoCard";

const VideoList = ({ refreshTrigger, onVideosUpdate }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from("video-clips").list();

      if (error) {
        throw error;
      }

      // 取得每個影片的公開連結
      const videosWithUrls = await Promise.all(
        data
          .filter((d) => !d.name.includes(".emptyFolderPlaceholder"))
          .map(async (video) => {
            const {
              data: { publicUrl },
            } = supabase.storage.from("video-clips").getPublicUrl(video.name);

            // 從檔名中提取時間戳
            const timestamp = parseInt(video.name.split("_")[0]);
            const uploadedAt = new Date(timestamp);

            return {
              ...video,
              publicUrl,
              uploadedAt,
              timestamp, // 保存原始時間戳用於排序
            };
          })
      );

      // 依照上傳時間排序（最新的在前）
      const sortedVideos = videosWithUrls.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setVideos(sortedVideos);

      // 確保在設置完 videos 後再通知父組件
      if (onVideosUpdate) {
        onVideosUpdate(sortedVideos);
      }
    } catch (err) {
      setError(err.message);
      console.error("獲取影片清單失敗：", err);
    } finally {
      setLoading(false);
    }
  }, [onVideosUpdate]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos, refreshTrigger]);

  const handlePlayVideo = (video) => {
    // 將影片資訊存儲在 localStorage 中
    localStorage.setItem(
      "currentVideo",
      JSON.stringify({
        url: video.publicUrl,
        name: video.name.split("_").slice(1).join("_"),
      })
    );
    // 使用 React Router 導航
    navigate("/player");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-secondary">載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>載入失敗：{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary">影片清單</h2>
        <button
          onClick={fetchVideos}
          className="px-3 py-1 text-sm bg-primary-dark text-primary-light rounded-md hover:bg-primary transition-colors"
        >
          重新整理
        </button>
      </div>

      {videos.length === 0 ? (
        <p className="text-secondary-light text-center py-8">目前沒有影片</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.name}
              video={video}
              onPlay={handlePlayVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
