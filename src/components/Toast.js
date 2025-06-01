import React, { useEffect, useState } from "react";

const Toast = ({ message, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      // 等待動畫完成後再關閉
      setTimeout(() => {
        onClose();
      }, 300); // 動畫持續時間
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
        isLeaving ? "animate-slide-up" : "animate-slide-down"
      }`}
    >
      <div className="bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
