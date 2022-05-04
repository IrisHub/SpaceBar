import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const VideoContainer = styled.div`
  position: absolute;
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

export const Video = styled.video`
  height: ${(props) => props.height || 150}px;
  width: ${(props) => props.width || 150}px;
  background-color: ;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: rgb(220, 220, 220, 0.5);
  border-radius: 32px;
`;

//  Boolean change color to red
export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
  margin: 2%;
`;
