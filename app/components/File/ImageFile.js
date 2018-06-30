import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Canvas from './Canvas.js';
import * as zip from './../../lib/zip.js';
import * as image from './../../lib/image.js';

export const allowedExts = [
  "jpg",
  "jpeg",
  "png",
]

class ImageFile extends PureComponent {
  state = {
    index: 0,
    width: null,
    height: null,
    images: [],
    loading: true,
    drawComplete: 0,
  };

  handleKeyUp = (event) => {
    if (this.props.tagsDialogOpen) return;
    event.preventDefault();
    const {altKey, ctrlKey, key, keyCode, metaKey, shiftKey} = event;
    console.log(
      "keyup",
      "altKey", altKey,
      "ctrlKey", ctrlKey,
      "metaKey", metaKey,
      "shiftKey", shiftKey,
      "key", key,
      "keyCode", keyCode,
    );
    if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
      switch(keyCode) {
      case 37:
      case 32:
        this.nextPage();
        return;
      case 39:
        this.prevPage();
        return;
      }
    }
    if (shiftKey) {
      switch(keyCode) {
      case 32:
        this.prevPage();
        return;
      }
    }
    if (ctrlKey) {
      switch(keyCode) {
      case 83: // S
        this.props.filePerPageChanged(
          this.props.perPage === 2 ? 1 : 2
        )
        return;
      }
    }
  }

  handleResize = () => {
    this.setState((state) => {
      const {innerWidth, innerHeight} = window;
      return {
        ...(state.width !== innerWidth ? {width: innerWidth} : {}),
        ...(state.height !== innerHeight ? {height: innerHeight} : {}),
      };
    });
  }

  loadZipFile = () => {
    const {path} = this.props.file;
    return zip.read(path).then((zip) => {
      const images = [];

      zip.forEach((_, e) => {
        if (!e.dir) {
          const names = e.name.split("/");
          const name = names[names.length - 1];
          const ext = require('path').extname(name).substring(1).toLowerCase();

          if (allowedExts.includes(ext)) {
            images.push({
              name,
              ext,
              data: e,
            });
          }
        }
      });

      return images;
    });
  }

  sortImages = (images) => {
    return images.sort((a, b) => image.sort(a.name, b.name));
  }

  handleDrawComplete = () => this.setState((state) => ({
    drawComplete: state.drawComplete + 1,
  }));

  resetDrawComplete = (cb) => this.setState(
    () => ({drawComplete: 0}),
    cb
  );

  nextPage = () => {
    const { perPage, notifyMessage } = this.props;
    const { images, index } = this.state;
    if ((index + 1) + (perPage - 1) > images.length - 1) {
      notifyMessage("This is last page.")
      return;
    }

    const nextIndex = Math.min(
      index === 0 ? index + 1 :(index + perPage),
      (images.length - 1)
    );

    this.resetDrawComplete(() => this.setState({
      index: nextIndex,
    }))
  }

  prevPage = () => {
    const {index} = this.state;
    const {perPage} = this.props
    const nextIndex = Math.max(0, index - perPage);
    this.resetDrawComplete(() => this.setState({
      index: nextIndex,
    }));
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.loadZipFile().
      then(this.sortImages).
      then((images) => this.setState({
        images,
        loading: false,
      })).catch((error) => {
        const { fileLoadError, directory, file } = this.props;
        fileLoadError({
          message: error.message,
          code: error.code,
        }, directory, file);
      });
  }

  renderCanvases = () => {
    const { perPage } = this.props;
    const {
      index,
      width, height,
      images,
      drawComplete
    } = this.state;


    const imagesToDisplay = index === 0 ?
          images.slice(0, 1) :
          images.slice(index, index + perPage).reverse();

    const drawCount = Math.min(imagesToDisplay.length, perPage);

    const style = {
      ...(drawComplete >= drawCount ?
          {} : { display: "none" }),
    };

    return imagesToDisplay.map((e, i) => {
      const justify = drawCount === 2 ?
            (i === 0 ? "flex-end" : "flex-start") : "center";

      return (
        <Grid item xs={12 / drawCount} key={i} >
          <Grid
            container
            direction="row"
            alignItems="center"
            justify={justify}
            style={style}
            >
            <Canvas
              image={e}
              width={width / drawCount}
              height={height}
              onDrawComplete={this.handleDrawComplete}
              />
          </Grid>
        </Grid>
      );
    })
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("resize", this.handleResize);
  }

  render() {
    const {
      height,
      loading,
    } = this.state;

    if (loading) return null;

    return (
      <Grid
        container
        alignItems="center"
        style={{height}}
        >
        {this.renderCanvases()}
      </Grid>
    )
  }
}

export default ImageFile;
