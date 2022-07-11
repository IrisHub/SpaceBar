import React from 'react';

import { DialogContainer, DialogText } from './DialogStyled';

interface DialogProps {
  text: string;
  color: string;
}
/**
 * Renders a dialog component.  Accepts props for what message to display &
 * what color to render the dialog in.
 * @returns Dialog component
 */
const Dialog = (props: DialogProps) => {
  return (
    <DialogContainer color={props.color}>
      <DialogText>{props.text}</DialogText>
    </DialogContainer>
  );
};

export default Dialog;
