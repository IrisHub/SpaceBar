import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
// import { ReactComponent as VideoCam } from '../icons/videocam.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophoneSlash,
  faMicrophone,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';

const VideoContainer = styled.div`
  position: absolute;
  z-index: 999;
`;

const Video = styled.video`
  height: ${(props) => props.height || 150}px;
  width: ${(props) => props.width || 150}px;
`;

const MicrophoneSlash = styled(FontAwesomeIcon)`
  color: #ed4650;
`;

const Microphone = styled(FontAwesomeIcon)`
  color: black;
`;

const VideoIcon = styled(FontAwesomeIcon)`
  color: black;
`;

const VideoIconSlash = styled(FontAwesomeIcon)`
  color: #ed4650;
`;

type VideoProps = {
  height?: number;
  width?: number;
};

enum VideoAudioOptions {
  audio = 'audio',
  video = 'video',
}

function VideoPlayer(props: VideoProps) {
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const permissions = {
    video: true,
    audio: true,
  };

  let videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function getMedia() {
      try {
        let stream = await navigator.mediaDevices.getUserMedia(permissions);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
      }
    }
    getMedia();
  }, []);

  function toggleVideoAudio(trackKind: VideoAudioOptions) {
    if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(function (track) {
        if (track.readyState == 'live' && track.kind === trackKind) {
          track.enabled = !track.enabled;
        }
      });
    } else {
      console.error('No valid src object present');
    }
  }

  function handleVideo() {
    setVideoOn(!videoOn);
    toggleVideoAudio(VideoAudioOptions.video);
  }

  function handleAudio() {
    setAudioOn(!audioOn);
    toggleVideoAudio(VideoAudioOptions.audio);
  }

  return (
    <VideoContainer>
      <Video
        ref={videoRef}
        height={props.height}
        width={props.width}
        autoPlay
      ></Video>

      {audioOn ? (
        <Microphone onClick={handleAudio} icon={faMicrophone} />
      ) : (
        <MicrophoneSlash onClick={handleAudio} icon={faMicrophoneSlash} />
      )}

      {videoOn ? (
        <VideoIcon onClick={handleVideo} icon={faVideo} />
      ) : (
        <VideoIconSlash onClick={handleVideo} icon={faVideoSlash} />
      )}
    </VideoContainer>
  );
}

export default VideoPlayer;
