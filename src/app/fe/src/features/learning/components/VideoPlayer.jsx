import React, { useRef } from "react";

export function VideoPlayer({ videoUrl, isWatched, onVideoEnd }) {
  const videoRef = useRef(null);

  return (
    <div
      style={{
        marginBottom: "20px",
        background: "#000",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <video
        ref={videoRef}
        controls
        src={videoUrl}
        onEnded={onVideoEnd}
        style={{ width: "100%", maxHeight: "400px", borderRadius: "4px" }}
      />
      <div
        style={{
          marginTop: "10px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          Trạng thái video: {isWatched ? "✅ Đã xem xong" : "⏳ Chưa xem xong"}
        </span>
        {!isWatched && (
          <button
            onClick={onVideoEnd}
            style={{
              padding: "4px 8px",
              background: "#ffc107",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            [Dev Test] Bấm nhanh xem xong Video
          </button>
        )}
      </div>
    </div>
  );
}
