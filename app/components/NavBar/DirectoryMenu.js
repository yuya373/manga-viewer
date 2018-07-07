import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

export default function DirectoryMenu({
  onClickReload,
}) {
  return (
    <IconButton
      onClick={onClickReload}
      color="inherit"
      >
      <RefreshIcon/>
    </IconButton>
  );
}
