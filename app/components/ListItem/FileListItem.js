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
import LabelIcon from '@material-ui/icons/LabelOutline';
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
    } = this.props
    const { isDialogOpen } = this.state;

    return (
      <React.Fragment>
        <TagsDialog
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
              <LabelIcon />
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
