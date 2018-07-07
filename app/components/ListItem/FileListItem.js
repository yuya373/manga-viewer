import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';
import LabelOutlineIcon from '@material-ui/icons/LabelOutline';
import FavoriteButton from './../FavoriteButton.js';
import TagsDialog from './../../containers/ListItem/TagsDialog.js';
import * as zip from './../../lib/zip.js';
import * as image from './../../lib/image.js';
import ListItem from './LazyListItem.js';
import DeleteIcon from '@material-ui/icons/Delete';
import Thumbnail from './Thumbnail.js';

const styles = theme => ({
  secondaryAction: {
    paddingRight: theme.spacing.unit * 4 * 4,
  },
});

class FileListItem extends Component {
  state = {
    isDialogOpen: false,
  };
  openDialog = () => this.setState({isDialogOpen: true});
  closeDialog = () => this.setState({isDialogOpen: false});
  handleClickFavorite = (favorite) => () =>
    this.props.onClickFavorite(!favorite);
  handleAddTag = (tag) => this.props.addTag(tag);
  handleDeleteTag = (tag) => this.props.deleteTag(tag);
  renderAvater = () => {
    const {
      file,
      thumbnailUrl,
      addThumbnailQueue,
      saveThumbnailUrl,
    } = this.props;

    return (
      <Thumbnail
        file={file}
        thumbnailUrl={thumbnailUrl}
        saveThumbnailUrl={saveThumbnailUrl}
        addThumbnailQueue={addThumbnailQueue}
        />
    );
  }

  handleClickDeleteFile = () => {
    const {
      onClickDelete,
      file,
      directory,
    } = this.props;
    onClickDelete({ file, directory });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.favorite !== nextProps.favorite) {
      console.log("shouldComponentUpdate: ", "favorite changed");
      return true;
    }
    if (this.props.tags.length !== nextProps.tags.length) {
      console.log("shouldComponentUpdate: ", "tags.length changed");
      return true;
    }
    if (this.state.isDialogOpen !== nextState.isDialogOpen) {
      console.log("shouldComponentUpdate: ", "state.isDialogOpen changed");
      return true;
    }
    return false;
  }

  render() {
    const {
      classes,
      file,
      onClick,
      favorite,
      tags,
    } = this.props
    const {
      isDialogOpen,
    } = this.state;

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
        <ListItem
          button
          classes={{secondaryAction: classes.secondaryAction}}
          onClick={onClick}
          onDisplay={this.props.onDisplay}
          >
          {this.renderAvater()}
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
            <IconButton
              onClick={this.handleClickDeleteFile}
              >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(FileListItem);
