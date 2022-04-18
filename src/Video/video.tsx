import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: absolute;
  z-index: 999;
`;

const AudioToggle = styled.button``;
const VideoToggle = styled.button``;

function VideoPlayer() {
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

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

  function toggleVideoAudio(trackKind: string) {
    if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(function (track) {
        if (track.readyState == 'live' && track.kind === trackKind) {
          // track.stop(); Permanent
          track.enabled = !track.enabled;
        }
      });
    } else {
      console.error('No valid src object present');
    }
  }

  function handleVideo() {
    console.log('video fired');
    setVideoOn(!videoOn);
    toggleVideoAudio('video');
  }

  function handleAudio() {
    console.log('audio fired');
    setAudioOn(!audioOn);
    toggleVideoAudio('audio');
  }

  return (
    <VideoContainer>
      <video
        ref={videoRef}
        className="vid"
        height="120"
        width="160"
        autoPlay
      ></video>

      <AudioToggle onClick={handleAudio}>Audio </AudioToggle>
      <VideoToggle onClick={handleVideo}> Video</VideoToggle>
    </VideoContainer>
  );
}

export default VideoPlayer;
