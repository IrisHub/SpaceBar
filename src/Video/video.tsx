import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
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
  display: flex;
  flex-direction: column;
`;

const Video = styled.video`
  height: ${(props) => props.height || 150}px;
  width: ${(props) => props.width || 150}px;
  background-color: black;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: rgb(220, 220, 220, 0.5);
  border-radius: 32px;
`;

const MicrophoneSlash = styled(FontAwesomeIcon)`
  color: #ed4650;
  margin: 2%;
`;

const Microphone = styled(FontAwesomeIcon)`
  color: black;
  margin: 2%;
`;

const VideoIcon = styled(FontAwesomeIcon)`
  color: black;
  margin: 2%;
`;

const VideoIconSlash = styled(FontAwesomeIcon)`
  color: #ed4650;
  margin: 2%;
`;

type VideoProps = {
  height?: number;
  width?: number;
};

enum VideoAudioOptions {
  audio = 'audio',
  video = 'video',
  all = 'all',
}

/**
 * VideoPlayer component renders configurable video & audio media from a user's device.
 * Renders UI to toggle audio & video on & off.
 *
 * The component uses the useRef hook to obtain a reference to a <video/> component.
 * It requests permission for audio / video with navigator.mediaDevices.getUserMedia()
 * in useEffect hooks invoked upon component mount & upon change in audioOn or videoOn state.
 * The srcObject of the video Ref is then set to the stream returned from the navigator browser API.
 *
 * On a state change update to end video or audio, endMedia is invoked with appropriate type specified.
 * This function then stops each appropriate live track to end the stream & turn off the user's webcam light.
 *
 * On a state change update to start video or audio, endMedia is invoked again to clear any current active streams,
 * then startMedia is invoked to receive a stream from the navigator browser API and reset videoRef's srcObject to this stream.
 * @param props VideoProps
 * @returns
 */
function VideoPlayer(props: VideoProps) {
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  let videoRef = useRef<HTMLVideoElement | null>(null);

  function endMedia(trackKind: VideoAudioOptions) {
    try {
      if (videoRef.current?.srcObject) {
        let stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(function (track) {
          if (trackKind === 'all') {
            if (track.readyState == 'live') {
              track.stop();
            }
          } else {
            if (track.readyState == 'live' && track.kind === trackKind) {
              track.stop();
            }
          }
        });
      }
    } catch (err) {
      //TODO: Log errors to internal log
      throw err;
    }
  }

  async function startMedia(permissions: MediaStreamConstraints) {
    let stream = await navigator.mediaDevices.getUserMedia(permissions);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }

  function configurePermissions() {
    let newPermissions;
    if (!videoOn && audioOn) {
      newPermissions = {
        audio: true,
      };
    } else if (videoOn && !audioOn) {
      newPermissions = {
        video: true,
      };
    } else {
      newPermissions = {
        video: true,
        audio: true,
      };
    }
    return newPermissions;
  }

  useEffect(() => {
    async function getMedia() {
      try {
        let permissions = configurePermissions();
        startMedia(permissions);
      } catch (err) {
        // TODO: handle common error status described here
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        throw err;
      }
    }
    getMedia();
  }, []);

  useEffect(() => {
    async function updateAudio() {
      if (!audioOn) {
        endMedia(VideoAudioOptions.audio);
      } else {
        let permissions = configurePermissions();
        endMedia(VideoAudioOptions.all);
        startMedia(permissions);
      }
    }
    updateAudio();
  }, [audioOn]);

  useEffect(() => {
    async function updateVideo() {
      if (!videoOn) {
        endMedia(VideoAudioOptions.video);
      } else {
        let permissions = configurePermissions();
        endMedia(VideoAudioOptions.all);
        startMedia(permissions);
      }
    }
    updateVideo();
  }, [videoOn]);

  async function handleVideo() {
    setVideoOn(!videoOn);
  }

  async function handleAudio() {
    setAudioOn(!audioOn);
  }

  return (
    <VideoContainer>
      <Video
        ref={videoRef}
        height={props.height}
        width={props.width}
        autoPlay
      ></Video>

      <IconContainer>
        {audioOn ? (
          <Microphone onClick={handleAudio} icon={faMicrophone} />
        ) : (
          <MicrophoneSlash onClick={handleAudio} icon={faMicrophoneSlash} />
        )}
        {videoOn ? (
          <VideoIcon onClick={handleVideo} icon={faVideo} />
        ) : (
          <VideoIconSlash onClick={handleVideo} icon={faVideoSlash} />
        )}{' '}
      </IconContainer>
    </VideoContainer>
  );
}

export default VideoPlayer;
