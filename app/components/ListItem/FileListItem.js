import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import List, {
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
import LazyListItem from './LazyListItem.js';

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

class FileListItem extends PureComponent {
  state = {
    isDialogOpen: false,
    thumbnailUrl: null,
    popoverAnchorEl: null,
    popoverOpen: false,
  };
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
    const { path, thumbnailUrl } = this.props.file;
    if (this.mounted && this.ext(path) === "zip") {
      if (thumbnailUrl) {
        this.setState({thumbnailUrl})
      } else {
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

    if (!thumbnailUrl) return null;
    return (
      <Avatar
        ref={(ref) => this.avatarRef = ref}
        classes={{img: classes.avaterImg}}
        className={classNames(
          classes.avater,
          { [classes.avaterWithPopover] : popoverOpen }
        )}
        src={thumbnailUrl}
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

  componentDidMount() {
    this.mounted = true;
    this.loadThumbnail();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      classes,
      file,
      onClick,
      favorite,
      searchQuery,
      tags,
      onDisplay,
    } = this.props
    const {
      isDialogOpen,
    } = this.state;

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
        {this.renderPopover()}
        <LazyListItem
          classes={{secondaryAction: classes.secondaryAction}}
          onClick={onClick}
          onDisplay={onDisplay}
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
        </LazyListItem>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(FileListItem);
