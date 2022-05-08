import styled from 'styled-components';

export const DialogContainer = styled.div`
  position: absolute;
  border-radius: 36px;

  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 1%;
`;

export const DialogText = styled.div`
  z-index: 999;
  background-color: ${(props) => props.color};
`;
