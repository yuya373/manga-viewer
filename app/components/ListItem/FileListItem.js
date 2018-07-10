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
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import Thumbnail from './Thumbnail.js';

const styles = theme => ({
  secondaryAction: {
    paddingRight: theme.spacing.unit * 17,
    paddingLeft: theme.spacing.unit * 2,
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
      isScrolling,
    } = this.props;

    return (
      <Thumbnail
        isScrolling={isScrolling}
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
    if (this.props.isScrolling !== nextProps.isScrolling) {
      console.log("shouldComponentUpdate: ", "isScrolling changed");
      return true;
    }
    return false;
  }

  renderTagsDialog = () => {
    const {
      isScrolling,
      tags,
      file,
    } = this.props;

    if (isScrolling) return null;

    const {
      isDialogOpen,
    } = this.state;

    return (
      <TagsDialog
        tags={tags}
        open={isDialogOpen}
        file={file}
        onClose={this.closeDialog}
        />
    );
  }

  render() {
    const {
      classes,
      file,
      onClick,
      favorite,
      tags,
      primaryTypographyProps,
      isScrolling,
    } = this.props

    const tagIcon = tags.length > 0 ?
          (<LabelIcon />) : (<LabelOutlineIcon />);

    const buttonBaseProps = {
      disableRipple: isScrolling,
      disableTouchRipple: isScrolling,
    };

    return (
      <React.Fragment>
        {this.renderTagsDialog()}
        <ListItem
          button={true}
          classes={{secondaryAction: classes.secondaryAction}}
          onClick={onClick}
          ContainerComponent="div"
          {...buttonBaseProps}
          >
          {this.renderAvater()}
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            >
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
