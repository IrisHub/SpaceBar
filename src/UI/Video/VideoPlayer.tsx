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
import Dialog from '../Dialog/Dialog';

interface VideoProps {
  height?: number;
  width?: number;
}

enum AVOptions {
  audio,
  video,
  all,
}

enum AVErrors {
  NotFoundError,
  NotReadableError,
  OverconstrainedError,
  NotAllowedError,
  OtherError,
}

const AVErrorMessages: Record<string, string> = {
  NotFoundError:
    'Your device does not have a webcam or microphone to support this.',
  NotReadableError: 'Your webcam or microphone are already in use. ',
  OverconstrainedError:
    'Your device cannot satisfy the current audio and video constraints. ',
  NotAllowedError:
    'Permission for the camera or audio has been denied in the browser.',
  OtherError: 'An error has occured. Please refresh & try again.',
};

/**
 * `VideoPlayer` renders video & audio media from a user's device.
 *  Renders video & audio icon buttons to toggle video on & off.
 *  Renders a dialog box with an error message if a request to use the device's audio and or media is unsuccessful.
 *
 *  Implemented by requesting permission to the web API navigator.mediaDevices.getUserMedia().
 *  The stateful component uses a ref to the video element to manage toggling video & audio.
 * @param props VideoProps
 * @returns <VideoPlayer>
 */
const VideoPlayer = (props: VideoProps) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [errMessageOnUserMedia, setErrMessageOnUserMedia] = useState('');

  let videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * endMedia obtains a ref to the current MediaStream if it exists,
   * then iterates through each track of this stream to toggle off audio, video, or all.
   * @param selectedTrackKind user selected track kind to toggle
   */
  const endMedia = (selectedTrackKind: AVOptions) => {
    if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(function (track: MediaStreamTrack) {
        if (track.readyState === 'live') {
          if (
            selectedTrackKind === AVOptions.all ||
            AVOptions[selectedTrackKind] === track.kind
          ) {
            track.stop();
          }
        }
      });
    }
  };

  /*
   * startMedia starts the stream with a call to navigator.mediaDevices.getUserMedia.
   * On error, sets an error state and toggles state to render a Dialog component.
   */
  const startMedia = async (permissions: MediaStreamConstraints) => {
    try {
      let stream = await navigator.mediaDevices.getUserMedia(permissions);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      if (err.name in AVErrorMessages) {
        setErrMessageOnUserMedia(AVErrorMessages[err.name]);
      } else {
        setErrMessageOnUserMedia(
          AVErrorMessages[AVErrors[AVErrors.OtherError]]
        );
      }
    }
  };

  /*
   * configurePermissions sets video & audio permissions for calls to startMedia.
   */
  const configurePermissions = () => {
    let newPermissions = {
      video: videoEnabled,
      audio: audioEnabled,
    };
    return newPermissions;
  };

  /*
   * On mount of VideoPlayer, requests permission for video & audio streams.
   */
  useEffect(() => {
    const getMedia = async () => {
      let permissions = configurePermissions();
      await startMedia(permissions);
    };
    getMedia();
  }, []);

  /*
   * On change of audioEnabled state, ends or restarts audio media.
   */
  useEffect(() => {
    const updateAudio = async () => {
      if (!audioEnabled) {
        endMedia(AVOptions.audio);
      } else {
        let permissions = configurePermissions();
        endMedia(AVOptions.all);
        await startMedia(permissions);
      }
    };
    updateAudio();
  }, [audioEnabled]);

  /*
   * On change of videoEnabled state, ends or restarts video media.
   */
  useEffect(() => {
    const updateVideo = async () => {
      if (!videoEnabled) {
        endMedia(AVOptions.video);
      } else {
        let permissions = configurePermissions();
        endMedia(AVOptions.all);
        await startMedia(permissions);
      }
    };
    updateVideo();
  }, [videoEnabled]);

  /*
   * toggleVideo sets the videoEnabled boolean state in an onClick from the video Icon
   */
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  /*
   * toggleAudio sets the audioEnabled boolean state in an onClick from the audio Icon
   */
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <>
      {errMessageOnUserMedia && (
        <Dialog text={errMessageOnUserMedia} color={Colors.warningRed} />
      )}

      {!errMessageOnUserMedia && (
        <VideoContainer>
          <Video
            ref={videoRef}
            height={props.height}
            width={props.width}
            autoPlay
          ></Video>

          <IconContainer>
            <Icon
              onClick={toggleAudio}
              icon={audioEnabled ? faMicrophone : faMicrophoneSlash}
              color={audioEnabled ? Colors.black : Colors.warningRed}
            />
            <Icon
              onClick={toggleVideo}
              icon={videoEnabled ? faVideo : faVideoSlash}
              color={videoEnabled ? Colors.black : Colors.warningRed}
            />
          </IconContainer>
        </VideoContainer>
      )}
    </>
  );
};

export default VideoPlayer;
