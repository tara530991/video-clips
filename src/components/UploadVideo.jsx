import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const UploadVideo = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      console.log("extension", extension);

      if (extension !== "mp4" && extension !== "mov" && extension !== "webm") {
        throw new Error("請上傳 MP4, WebM, MOV 格式");
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    try {
      const fileName = `${Date.now()}_${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("video-clips")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
        error: urlError,
      } = supabase.storage.from("video-clips").getPublicUrl(fileName);

      if (urlError) {
        throw new Error(urlError.message);
      }

      if (onUploadSuccess) {
        onUploadSuccess(publicUrl);
      }

      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
      console.error("上傳失敗：", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-error rounded-md text-sm">
          {error}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? "border-primary bg-primary/20" : "border-primary-dark"}
          ${selectedFile ? "bg-primary/10" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-secondary font-medium">{selectedFile.name}</p>
            <p className="text-sm text-secondary-light">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-primary-dark"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-secondary">點擊或拖曳檔案至此處上傳</p>
            <p className="text-sm text-secondary-light">
              支援 MP4, WebM, MOV 格式
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {selectedFile && (
          <button
            onClick={() => setSelectedFile(null)}
            className="px-4 py-2 text-secondary-light hover:text-secondary transition-colors"
          >
            取消
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`px-4 py-2 rounded-md transition-colors
            ${
              selectedFile && !uploading
                ? "bg-primary-dark text-primary-light hover:bg-primary"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {uploading ? "上傳中..." : "上傳"}
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;
