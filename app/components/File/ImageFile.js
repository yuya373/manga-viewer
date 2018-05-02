import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Canvas from './Canvas.js';
import fs from 'fs';
import JSZip from 'jszip';

const allowedExts = [
  "jpg",
  "jpeg",
  "png",
]

class ImageFile extends Component {
  state = {
    index: 0,
    width: null,
    height: null,
    images: [],
    loading: true,
  };

  handleKeyUp = (event) => {
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

  readZipFile = () => {
    const {path} = this.props.file;
    const pStart = performance.now();
    return new Promise((resolve, reject) => {
      fs.readFile(path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          const pEnd = performance.now();
          console.log(
            "readZipFile", pEnd - pStart,
            " MB: ", data.length / 1000000
          );
          resolve(data);
        }
      })
    })
  }

  loadZipFile = (data) => {
    const pStart = performance.now();
    return JSZip.loadAsync(data).then((zip) => {
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

      const pEnd = performance.now();
      console.log("loadZipFile: ", pEnd - pStart, zip);
      return images;
    });
  }

  sortImages = (images) => {
    return images.sort((a, b) => {
      const ANumStr = a.name.match(/\d+/)[0];
      const BNumStr = b.name.match(/\d+/)[0];
      if ((typeof ANumStr) !== 'undefined' && (typeof BNumStr) !== 'undefined') {
        const ANum = Number.parseInt(ANumStr, 10);
        const BNum = Number.parseInt(BNumStr, 10);
        if (!Number.isNaN(ANum) && !Number.isNaN(BNum)) {
          if (ANum < BNum) return -1;
          if (ANum > BNum) return 1;
          return 0;
        }
      }

      const A = a.name.toLowerCase();
      const B = b.name.toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.readZipFile().
      then(this.loadZipFile).
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

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("resize", this.handleResize);
  }

  nextPage() {
    const {perPage} = this.props;
    const {images} = this.state;
    const {index} = this.state;
    if ((index + 1) + (perPage - 1) > images.length - 1) {
      return;
    }

    const nextIndex = Math.min(index + perPage, (images.length - 1));
    this.setState({index: nextIndex});
  }

  prevPage() {
    const {index} = this.state;
    const {perPage} = this.props
    const nextIndex = Math.max(0, index - perPage);
    this.setState({index: nextIndex});
  }

  render() {
    const {index, width, height, loading, images} = this.state;
    if (loading) return null;

    const {file, perPage} = this.props;


    const gridProps = (i) => ({
      justify: perPage === 2 ?
        (i === 0 ? "flex-end" : "flex-start") :
        "center",
    })
    const canvases = images.slice(index, index + perPage).reverse().map((e, i) => (
      <Grid item xs={12 / perPage} key={i} >
        <Grid
          container
          direction="row"
          alignItems="center"
          {...(gridProps(i))}
          >
          <Canvas
            image={e}
            width={window.innerWidth / perPage}
            height={window.innerHeight}
            />
        </Grid>
      </Grid>
    ))

    return (
      <Grid
        container
        alignItems="center"
        style={{height}}
        >
        {canvases}
      </Grid>
    )
  }
}

export default ImageFile;
