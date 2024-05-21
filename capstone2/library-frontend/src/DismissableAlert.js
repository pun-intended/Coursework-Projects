import { useState } from "react";
import { Alert } from "reactstrap";

function DismissableAlert(message, color, id, removeAlert) {
    function fade(id) {
      (`#${id}`).fadeOut(600, () => {removeAlert(id)})
    }
    window.setTimeout(() => { fade(id)}, 5000)
    
    return(
      <Alert color={color} isOpen={true} id={id} toggle={() => { fade(id) }}>{message}</Alert>
    )
  }

export default DismissableAlert