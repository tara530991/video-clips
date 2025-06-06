import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UploadVideo from "../components/UploadVideo";
import VideoList from "../components/VideoList";
import Toast from "../components/Toast";

const HomePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasVideos, setHasVideos] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setShowToast(true);
  }, []);

  const handleVideoListUpdate = useCallback((videos) => {
    setHasVideos(videos && videos.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {showToast && (
        <Toast
          message="Upload Successful"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            Video Management System
          </h1>
        </div>

        <div
          className={`grid ${
            hasVideos
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 max-w-2xl mx-auto"
          } gap-8`}
        >
          {/* Left: Upload Area */}
          <div className="bg-primary-light rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-secondary mb-4">
              Upload Video
            </h2>
            <UploadVideo onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Right: Video List */}
          {hasVideos && (
            <div className="bg-primary-light rounded-lg p-6 shadow-md">
              <VideoList
                refreshTrigger={refreshTrigger}
                onVideosUpdate={handleVideoListUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
