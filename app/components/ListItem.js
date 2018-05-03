import React, { PureComponent } from 'react';
import List, {
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutline';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './FavoriteButton.js';
import TagsDialog from './ListItem/TagsDialog.js';

export default class ListItem extends PureComponent {
  state = {
    isDialogOpen: false,
  };
  openDialog = () => this.setState({isDialogOpen: true});
  closeDialog = () => this.setState({isDialogOpen: false});

  render() {
    const {
      text,
      favorite = false,
      isDirectory = false,
      onClick,
      onClickFavorite,
      addTag,
      deleteTag,
      tags,
    } = this.props;
    const { isDialogOpen } = this.state;

    const folderIcon = isDirectory ? (
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
    ) : null;

    const tagsDialog = !isDirectory ? (
      <TagsDialog
        title={text}
        tags={tags}
        open={isDialogOpen}
        onClose={this.closeDialog}
        onAddTag={addTag}
        onDeleteTag={deleteTag}
        />
    ) : null;

    return (
      <React.Fragment>
        {tagsDialog}
        <MuiListItem
          button
          onClick={onClick}
          >
          {folderIcon}
          <ListItemText>
            {text}
          </ListItemText>
          <ListItemSecondaryAction>
            <FavoriteButton
              favorite={favorite}
              onClick={onClickFavorite}
              />
            <IconButton
              onClick={this.openDialog}
              aria-label="Info"
              >
              <InfoIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </MuiListItem>
      </React.Fragment>
    );
  }
}
