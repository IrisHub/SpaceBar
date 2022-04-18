import React, { useRef, useEffect, useState } from 'react';
import './video.css';
function VideoPlayer() {
  const permissions = {
    video: true,
    audio: true,
  };

  let videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function getMedia() {
      let stream = await navigator.mediaDevices.getUserMedia(permissions);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      return stream;
    }
    getMedia();
  }, []);

  return (
    <video
      ref={videoRef}
      className="vid"
      height="120"
      width="160"
      autoPlay
    ></video>
  );
}

export default VideoPlayer;
