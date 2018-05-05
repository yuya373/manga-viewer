import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import List, {
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import LabelIcon from '@material-ui/icons/Label';
import LabelOutlineIcon from '@material-ui/icons/LabelOutline';
import FavoriteButton from './../FavoriteButton.js';
import TagsDialog from './../../containers/ListItem/TagsDialog.js';

const styles = theme => ({
  secondaryAction: {
    paddingRight: theme.spacing.unit * 4 * 4,
  },
});

class FileListItem extends PureComponent {
  state = {
    isDialogOpen: false,
  };
  openDialog = () => this.setState({isDialogOpen: true});
  closeDialog = () => this.setState({isDialogOpen: false});
  handleClickFavorite = (favorite) => () => this.props.onClickFavorite(!favorite);
  handleAddTag = (tag) => this.props.addTag(tag);
  handleDeleteTag = (tag) => this.props.deleteTag(tag);

  render() {
    const {
      classes,
      file,
      onClick,
      favorite,
      searchQuery,
      tags,
    } = this.props
    const { isDialogOpen } = this.state;

    if (searchQuery.length > 0) {
      if (file.name.indexOf(searchQuery) < 0 &&
          !tags.some((e) => e.indexOf(searchQuery) >= 0)) {
        return null;
      }
    }

    const tagIcon = tags.length > 0 ?
          (<LabelIcon />) : (<LabelOutlineIcon />);


    return (
      <React.Fragment>
        <TagsDialog
          tags={tags}
          open={isDialogOpen}
          file={file}
          onClose={this.closeDialog}
          />
        <MuiListItem
          classes={{secondaryAction: classes.secondaryAction}}
          button
          onClick={onClick}
          >
          <ListItemText>
            {file.name}
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              onClick={this.openDialog}
              aria-label="Info"
              >
              {tagIcon}
            </IconButton>
            <FavoriteButton
              favorite={favorite}
              onClick={this.handleClickFavorite(favorite)}
              />
          </ListItemSecondaryAction>
        </MuiListItem>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(FileListItem);
