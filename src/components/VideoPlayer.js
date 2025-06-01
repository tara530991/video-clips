import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({ videoUrl, videoName }) => {
  const [subtitles, setSubtitles] = useState([]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">影片播放</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary-dark text-primary-light rounded-md hover:bg-primary transition-colors"
          >
            返回列表
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：影片播放器 */}
          <div className="bg-primary-light rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-secondary mb-4">
              影片播放器
            </h2>
            <video
              className="w-full rounded-lg"
              src={videoUrl}
              controls
              autoPlay
            />
            <p className="mt-4 text-secondary font-medium">{videoName}</p>
          </div>

          {/* 右側：字幕區域 */}
          <div className="bg-primary-light rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">字幕區域</h2>
              <button className="px-3 py-1 text-sm bg-primary-dark text-primary-light rounded-md hover:bg-primary transition-colors">
                新增字幕
              </button>
            </div>

            {subtitles.length === 0 ? (
              <div className="text-center py-8 text-secondary-light">
                目前沒有字幕
              </div>
            ) : (
              <div className="space-y-4">
                {subtitles.map((subtitle, index) => (
                  <div key={index} className="p-4 bg-primary rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-secondary-light">
                        {subtitle.startTime} - {subtitle.endTime}
                      </span>
                      <button className="text-secondary-light hover:text-secondary">
                        編輯
                      </button>
                    </div>
                    <p className="text-secondary">{subtitle.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
