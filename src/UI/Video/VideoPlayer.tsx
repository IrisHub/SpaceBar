import React, { useRef, useEffect, useState } from 'react';
import {
  VideoContainer,
  Video,
  IconContainer,
  Icon,
} from './VideoPlayerStyled';

import {
  faMicrophoneSlash,
  faMicrophone,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../constants';

interface VideoProps {
  height?: number;
  width?: number;
}

enum AVOptions {
  AUDIO,
  VIDEO,
  ALL,
}

/**
 * `VideoPlayer` renders configurable video & audio media from a user's device.
 * Renders UI to toggle audio & video on & off.
 *
 * Uses the `useRef` hook to obtain a reference to a `<video/>` component.
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
 * @returns <VideoPlayer>
 */
function VideoPlayer(props: VideoProps) {
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  let videoRef = useRef<HTMLVideoElement | null>(null);

  function endMedia(selectedTrackKind: AVOptions) {
    const stringifiedSelectedTrackKind = AVOptions[selectedTrackKind];
    if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(function (track: MediaStreamTrack) {
        // if (track.readyState === 'ended') return;
        if (selectedTrackKind === AVOptions.ALL) {
          track.stop();
        } else if (stringifiedSelectedTrackKind === track.kind.toUpperCase()) {
          track.stop();
        }
      });
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
    let newPermissions = {
      video: videoOn,
      audio: audioOn,
    };
    return newPermissions;
  }

  useEffect(() => {
    async function getMedia() {
      try {
        let permissions = configurePermissions();
        await startMedia(permissions);
      } catch (err) {
        // TODO(SAM): handle common error status described here
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        throw err;
      }
    }
    getMedia();
  }, []);

  useEffect(() => {
    async function updateAudio() {
      if (!audioOn) {
        endMedia(AVOptions.AUDIO);
      } else {
        let permissions = configurePermissions();
        endMedia(AVOptions.ALL);
        await startMedia(permissions);
      }
    }
    updateAudio();
  }, [audioOn]);

  useEffect(() => {
    async function updateVideo() {
      if (!videoOn) {
        endMedia(AVOptions.VIDEO);
      } else {
        let permissions = configurePermissions();
        endMedia(AVOptions.ALL);
        await startMedia(permissions);
      }
    }
    updateVideo();
  }, [videoOn]);

  function handleVideo() {
    setVideoOn(!videoOn);
  }

  function handleAudio() {
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
        <Icon
          onClick={handleAudio}
          icon={audioOn ? faMicrophone : faMicrophoneSlash}
          color={audioOn ? Colors.black : Colors.warningRed}
        />
        <Icon
          onClick={handleVideo}
          icon={videoOn ? faVideo : faVideoSlash}
          color={videoOn ? Colors.black : Colors.warningRed}
        />
      </IconContainer>
    </VideoContainer>
  );
}

export default VideoPlayer;
