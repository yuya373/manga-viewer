import React from 'react';
import MuiSnackbar from 'material-ui/Snackbar';

export default function Snackbar({
  message, isOpen,
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
      onClose={hideSnackbar}
      />
  );
}
