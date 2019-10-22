import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteIcon from '@material-ui/icons/Delete';

type DispatchProps = {
  onPress: (path: string) => void;
};

export type StateProps = {
  path: string;
  isDeleting: boolean;
};

type Props = Pick<IconButtonProps, 'color'>;

const DeleteButton: React.FC<Props & StateProps & DispatchProps> = ({
  color,
  path,
  isDeleting,
  onPress,
}) => {
  const handleClick = () => {
    onPress(path);
  };

  return (
    <IconButton color={color} onClick={handleClick}>
      {isDeleting ? <DeleteIcon /> : <DeleteOutlineIcon />}
    </IconButton>
  );
};

export default DeleteButton;
