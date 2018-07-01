import React from 'react';
import MuiSnackbar from 'material-ui/Snackbar';

export default function Snackbar({
  message, autoHide, isOpen,
  hideSnackbar,
}) {
  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={isOpen}
      message={message}
      autoHideDuration={autoHide ? 1500 : null}
      onClose={hideSnackbar}
      />
  );
}
