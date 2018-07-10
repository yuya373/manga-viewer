import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import * as zip from './../../lib/zip.js';
import * as image from './../../lib/image.js';
import { allowedExts } from './../File/ImageFile.js';

const styles = (theme) => ({
  avater: {
    borderRadius: 0,
  },
  avaterWithPopover: {
    zIndex: theme.zIndex.modal + 1,
  },
  avaterImg: {
    objectFit: "contain",
  },
});

class Thumbnail extends Component {
  state = {
    thumbnailUrl: "",
    popoverOpen: false,
    popoverAnchorEl: null,
  }
  mounted = false;

  ext = (name) => {
    if (name) {
      return require("path").extname(name).
        substring(1).toLowerCase();
    }
    return null;
  }
  storeThumbnail = (url) => {
    if (this.mounted) {
      this.setState({thumbnailUrl: url})
    }
  }
  loadZipFile = () => {
    const {path} = this.props.file;
    return zip.read(path);
  }
  getFirstImage = (zip) => {
    return new Promise((resolve) => {
      const nullValue = { base64: null, ext: null };

      const ext = this.ext;
      const cover = Object.keys(zip.files).
            map((e) => ({ name: e, ext: ext(e) })).
            filter(({ name, ext }) => allowedExts.includes(ext)).
            sort((a, b) => image.sort(a.name, b.name))[0];

      if (cover) {
        return zip.files[cover.name].async("base64").
          then((base64) => ({base64, ext: ext(cover.name)})).
          then((ret) => resolve(ret));
      } else {
        resolve(nullValue);
      }
    });
  }
  storeImage = ({ base64, ext }) => {
    return new Promise((resolve) => {
      const url = image.base64Url(base64, ext);
      if (url) {
        resolve();

        window.setTimeout(() => {
          const { saveThumbnailUrl } = this.props;
          saveThumbnailUrl({ thumbnailUrl: url });
          this.storeThumbnail(url);
        });
      } else {
        resolve();
      }
    })
  }
  loadThumbnail = () => {
    return new Promise((resolve, reject) => {
      const { thumbnailUrl, file } = this.props;
      const { path } = file;
      if (this.ext(path) === "zip") {
        if (thumbnailUrl) {
          resolve();
          window.setTimeout(() => this.storeThumbnail(thumbnailUrl));
          console.log("thumbnailUrl exists");
        } else {
          console.log("thumbnailUrl NOT exists");
          this.loadZipFile().
            then(this.getFirstImage).
            then(this.storeImage).
            then(() => resolve()).
            catch((e) => {
              console.error(path, "DISPLAY ERROR", e);
              resolve();
            });
        }
      } else {
        resolve();
      }
    })
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
    if (!popoverOpen || !thumbnailUrl) return null;

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

  componentWillReceiveProps(nextProps) {
    if (this.props.isScrolling === true &&
        nextProps.isScrolling === false) {
      this.loadThumbnail();
    }
  }

  componentDidMount() {
    this.mounted = true;
    const { addThumbnailQueue, isScrolling } = this.props;
    if (addThumbnailQueue) {
      addThumbnailQueue(this.loadThumbnail);
    } else {
      if (!isScrolling) this.loadThumbnail();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      classes,
    } = this.props;
    const { thumbnailUrl, popoverOpen } = this.state;
    const src = thumbnailUrl;
    const className = classNames(
      classes.avater,
      { [classes.avaterWithPopover] : popoverOpen }
    )

    return (
      <React.Fragment>
        <Avatar
          classes={{img: classes.avaterImg}}
          className={className}
          src={src}
          onMouseOver={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
          />
        {this.renderPopover()}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Thumbnail);
