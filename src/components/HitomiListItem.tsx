import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import { File } from '../types';
import DeleteButtonContainer from '../containers/DeleteButtonContainer';

const useStyles = makeStyles({
  action: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  url: string;
};

export type StateProps = {
  isScraping: boolean;
  file?: File;
  error?: Error;
};

type DispatchProps = {
  onClickOpen: (param: {
    path: string;
    name: string;
    fromHitomi: true;
  }) => void;
};

const HitomiListItem: React.FC<Props & StateProps & DispatchProps> = ({
  url,
  isScraping,
  file,
  error,
  onClickOpen,
}) => {
  const classes = useStyles();

  const handleClick = () => {
    if (file == null) return;
    onClickOpen({
      path: file.path,
      name: file.name,
      fromHitomi: true,
    });
  };

  const deleteFileButton = file ? (
    <DeleteButtonContainer path={file.path} name={file.name} />
  ) : null;

  const progressIcon = isScraping ? <CircularProgress size={30} /> : null;
  const primaryText = file ? file.name : url;
  const secondaryText = error ? error.message : undefined;
  const listItemProps =
    file == null
      ? undefined
      : {
          button: true,
          onClick: handleClick,
        };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <ListItem alignItems="flex-start" {...listItemProps}>
      <ListItemText
        primary={primaryText}
        secondary={secondaryText}
        secondaryTypographyProps={{ color: 'error' }}
      />
      <ListItemSecondaryAction className={classes.action}>
        {deleteFileButton || progressIcon}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default HitomiListItem;
