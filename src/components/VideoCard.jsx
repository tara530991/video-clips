import { useState } from "react";
import { formatTime } from "../utils/formatTime";

const VideoCard = ({ video, onPlay }) => {
  const [duration, setDuration] = useState(0);
  return (
    <div className="bg-primary-light rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <video
          className="w-full h-48 object-cover"
          src={video.publicUrl}
          muted
          tabIndex={-1}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onMouseEnter={(e) => {
            e.currentTarget.play();
          }}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        {/* 右下角顯示總時長 */}
        <span className="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded select-none">
          {formatTime(duration)}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-secondary font-medium truncate">
          {video.name.split("_").slice(1).join("_")}
        </p>
        <p className="text-sm text-secondary-light">
          Uploaded: {video.uploadedAt.toLocaleString("en-US")}
        </p>
        <button
          onClick={() => onPlay(video)}
          className="mt-4 w-full px-4 py-2 bg-primary-dark text-primary-light rounded-md hover:bg-primary transition-colors"
        >
          Play Video
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
