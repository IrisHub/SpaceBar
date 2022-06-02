import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, DisplayConstants } from '../../constants';

export const VideoContainer = styled.div`
  position: absolute;
  z-index: 999;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.black};
`;

export const Video = styled.video`
  height: ${(props) => props.height || DisplayConstants.VideoPlayerHeight}px;
  width: ${(props) => props.width || DisplayConstants.VideoPlayerWidth}px;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${Colors.bgGrey};
`;

//  Boolean change color to red
export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
  margin: 2%;
`;
