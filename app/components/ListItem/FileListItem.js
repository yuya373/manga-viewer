import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import List, {
  // ListItem,
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
import * as zip from './../../lib/zip.js';
import * as image from './../../lib/image.js';
import { allowedExts } from './../File/ImageFile.js';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import ListItem from './LazyListItem.js';

const styles = theme => ({
  avater: {
    width: 50,
    height: 50,
    borderRadius: 0,
  },
  avaterWithPopover: {
    zIndex: theme.zIndex.modal + 1,
  },
  avaterImg: {
    objectFit: "contain",
  },
  secondaryAction: {
    paddingRight: theme.spacing.unit * 4 * 4,
  },
});

class FileListItem extends Component {
  mounted = false;
  openDialog = () => this.setState({isDialogOpen: true});
  closeDialog = () => this.setState({isDialogOpen: false});
  handleClickFavorite = (favorite) => () => this.props.onClickFavorite(!favorite);
  handleAddTag = (tag) => this.props.addTag(tag);
  handleDeleteTag = (tag) => this.props.deleteTag(tag);
  ext = (name) => {
    if (name) {
      return require("path").extname(name).
        substring(1).toLowerCase();
    }
    return null;
  }
  loadZipFile = () => {
    const {path} = this.props.file;
    return zip.read(path);
  }
  getFirstImage = (zip) => {
    if (this.mounted) {
      const ext = this.ext;
      const cover = Object.keys(zip.files).
            map((e) => ({ name: e, ext: ext(e) })).
            filter(({ name, ext }) => allowedExts.includes(ext)).
            sort((a, b) => image.sort(a.name, b.name))[0];

      if (cover) {
        return zip.files[cover.name].async("base64").
          then((base64) => ({base64, ext: ext(cover.name)}));
      }
    }
    return { base64: null, ext: null };
  }
  storeImage = ({ base64, ext }) => {
    if (this.mounted) {
      const url = image.base64Url(base64, ext);
      if (url) {
        const { saveThumbnailUrl } = this.props;
        this.setState(
          () => ({thumbnailUrl: url}),
          () => saveThumbnailUrl({ thumbnailUrl: url })
        );
      }
    }
  }
  loadThumbnail = () => {
    const { path } = this.props.file;
    if (this.mounted && this.ext(path) === "zip") {
      if (this.state.thumbnailUrl) {
        console.log("thumbnailUrl exists");
      } else {
        console.warn("thumbnailUrl NOT exists");
        this.loadZipFile().
          then(this.getFirstImage).
          then(this.storeImage).
          catch((e) => console.error(path, "DISPLAY ERROR", e));
      }
    }
  }

  renderAvater = () => {
    const { classes, file } = this.props;
    const { thumbnailUrl, popoverOpen } = this.state;

    return (
      <Avatar
        classes={{img: classes.avaterImg}}
        className={classNames(
          classes.avater,
          { [classes.avaterWithPopover] : popoverOpen }
        )}
        src={thumbnailUrl || ""}
        onMouseOver={this.handlePopoverOpen}
        onMouseLeave={this.handlePopoverClose}
        />
    );
  }

  handlePopoverClose = () => this.setState({
    popoverOpen: false,
  });
  handlePopoverOpen = (event) => this.setState({
    popoverAnchorEl: event.target,
    popoverOpen: true,
  });

  renderPopover = () => {
    const { popoverAnchorEl, popoverOpen, thumbnailUrl } = this.state;
    const { classes } = this.props;
    const getLeftOffset = () => {
      if (!popoverAnchorEl) {
        return 0;
      }
      return popoverAnchorEl.getBoundingClientRect().right;
    };

    const getImgStyle = () => {
      const leftOffset = getLeftOffset();
      const margin = 16;
      return {
        maxHeight: (window.innerHeight - margin),
        maxWidth: (window.innerWidth - margin) - leftOffset,
      };
    };

    return (
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        marginThreshold={16}
        >
        <img
          src={thumbnailUrl}
          style={getImgStyle()}
          />
      </Popover>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false,
      thumbnailUrl: props.file.thumbnailUrl,
      popoverAnchorEl: null,
      popoverOpen: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.loadThumbnail();
  }

  componentWillUnmount() {
    this.mounted = false;
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
    if (this.state.popoverAnchorEl !== nextState.popoverAnchorEl) {
      console.log("shouldComponentUpdate: ", "state.popoverAnchorEl changed");
      return true;
    }
    if (this.state.popoverOpen !== nextState.popoverOpen) {
      console.log("shouldComponentUpdate: ", "state.popoverOpen changed");
      return true;
    }
    if (this.state.thumbnailUrl !== nextState.thumbnailUrl) {
      console.log("shouldComponentUpdate: ", "state.thumbnailUrl changed");
      console.log(
        "this", (this.state.thumbnailUrl || "").length,
        "next", nextState.thumbnailUrl.length,
      );
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
        {this.renderPopover()}
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
          </ListItemSecondaryAction>
        </ListItem>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(FileListItem);
