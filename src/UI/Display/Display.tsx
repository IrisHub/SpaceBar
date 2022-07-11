import React from 'react';

import { DisplayConstants } from '../../constants';
import VideoPlayer from '../Video/VideoPlayer';

const Display = () => {
  return (
    <>
      <VideoPlayer
        height={DisplayConstants.VideoPlayerHeight}
        width={DisplayConstants.VideoPlayerWidth}
      />
    </>
  );
};

export default Display;
