import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Canvas from './Canvas.js';

class ImageFile extends Component {
  state = {
    index: 0,
    width: null,
    height: null,
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

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
    this.handleResize();
    document.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("resize", this.handleResize);
  }

  nextPage() {
    const {file, perPage} = this.props;
    const {index} = this.state;
    if ((index + 1) + (perPage - 1) > file.images.length - 1) {
      return;
    }

    const nextIndex = Math.min(index + perPage, (file.images.length - 1));
    this.setState({index: nextIndex});
  }

  prevPage() {
    const {index} = this.state;
    const {perPage} = this.props
    const nextIndex = Math.max(0, index - perPage);
    this.setState({index: nextIndex});
  }

  render() {
    const {index, width, height} = this.state;
    const {file, perPage} = this.props;

    const images = file.images.slice(index, index + perPage).reverse();
    const gridProps = (i) => ({
      justify: perPage === 2 ?
        (i === 0 ? "flex-end" : "flex-start") :
        "center",
    })
    const canvases = images.map((e, i) => (
      <Grid item xs={12 / perPage} key={i} >
        <Grid
          container
          direction="row"
          alignItems="center"
          {...(gridProps(i))}
          >
          <Canvas
            base64={e.base64}
            name={e.name}
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
