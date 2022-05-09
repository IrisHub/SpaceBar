import styled from 'styled-components';

export const DialogContainer = styled.div`
  position: absolute;
  border-radius: 16px;

  z-index: 999;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 2px solid ${(props) => props.color};
  padding: 1%;
`;

export const DialogText = styled.div`
  z-index: 999;
  font-size: 14px;
`;
