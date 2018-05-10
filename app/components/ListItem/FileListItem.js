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
import * as zip from './../../lib/zip.js';
import * as image from './../../lib/image.js';
import { allowedExts } from './../File/ImageFile.js';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
  avater: {
    width: 50,
    height: 50,
    borderRadius: 0,
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
    base64: null,
  };
  openDialog = () => this.setState({isDialogOpen: true});
  closeDialog = () => this.setState({isDialogOpen: false});
  handleClickFavorite = (favorite) => () => this.props.onClickFavorite(!favorite);
  handleAddTag = (tag) => this.props.addTag(tag);
  handleDeleteTag = (tag) => this.props.deleteTag(tag);
  loadZipFile = () => {
    const {path} = this.props.file;
    return zip.read(path);
  }
  getFirstImage = (zip) => {
    const ext = (name) => require("path").extname(name).
          substring(1).toLowerCase();

    const cover = Object.keys(zip.files).
          map((e) => ({ name: e, ext: ext(e) })).
          filter(({ name, ext }) => allowedExts.includes(ext)).
          sort((a, b) => image.sort(a.name, b.name))[0];

    return zip.files[cover.name].async("base64").
      then((base64) => ({base64, ext: ext(cover.name)}));
  }
  storeImage = ({ base64, ext }) => {
    const src = `data:image/${ext};base64,${base64}`;
    this.setState({base64: src});
  }
  loadThumbnail = () => {
    this.loadZipFile().
      then(this.getFirstImage).
      then(this.storeImage);
  }

  componentDidMount() {
    this.loadThumbnail();
  }

  render() {
    const {
      classes,
      file,
      onClick,
      favorite,
      searchQuery,
      tags,
    } = this.props
    const {
      isDialogOpen,
      base64,
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
        <MuiListItem
          classes={{secondaryAction: classes.secondaryAction}}
          button
          onClick={onClick}
          >
          <Avatar
            classes={{img: classes.avaterImg}}
            className={classes.avater}
            src={base64}
            />
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
