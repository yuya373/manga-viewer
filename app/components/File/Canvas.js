import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Canvas extends Component {
  canval = null;
  image = null;

  loadImageToCanvas = ({image, onDrawComplete}) => {
    const name = image.name
    const ext = image.ext
    const pStart = performance.now();
    image.data.async("base64").then((base64) => {
      const pEnd = performance.now();
      console.log("Image: ", name, " Loaded: ", pEnd - pStart);
      const image = new Image();
      image.onload = () => {
        this.renderImage();
        onDrawComplete();
      };
      image.src = `data:image/${ext};base64,${base64}`;
      this.image = image;
    });
  }

  backingStoreRatio = (context) => {
    // http://www.html5rocks.com/en/tutorials/canvas/hidpi/?redirect_from_locale=ja
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    if (devicePixelRatio !== backingStoreRatio) {
      const canvas = context.canvas;
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + "px";
      canvas.style.height = oldHeight + "px";

      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      context.scale(ratio, ratio);
    }
  }

  renderImage = () => {
    const image = this.image;
    const canvas = ReactDOM.findDOMNode(this.canvas);

    const {
      width,
      height,
    } = this.props;
    const ctx = canvas.getContext("2d");
    let w = null;
    let h = null;

    // console.log(
    //   "width", width,
    //   "height", height,
    //   "imageWidth", image.width,
    //   "imageHeight", image.height,
    // )

    if (image.width < width) {
      const d = width / image.width;
      w = image.width * d;
      h = image.height * d;
      // console.log("1", w, h, d);
      if (h > height) {
        const d = height / h;
        w = w * d;
        h = h * d;
        // console.log("2", w, h, d);
      }
    } else {
      const d = width / image.width;
      w = image.width * d;
      h = image.height * d;
      // console.log("3", w, h, d);
      if (h > height) {
        const d = height / h;
        w = w * d;
        h = h * d;
        // console.log("4", w, h, d);
      }
    }

    canvas.height = h;
    canvas.width = w;
    this.backingStoreRatio(ctx);
    ctx.drawImage(
      image, // source
      0, 0, // source point (x, y)
      image.width, image.height, // (x + dx, y + dy)
      0, 0, // target point (x, y)
      w, h // (x + dx, y + dy)
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log("props", this.props, "nextProps", nextProps);
    if (this.props.width !== nextProps.width ||
        this.props.height !== nextProps.height) {
      this.renderImage();
    }
    if (this.props.image.name !== nextProps.image.name) {
      this.loadImageToCanvas(nextProps);
    }
  }

  componentDidMount() {
    this.loadImageToCanvas(this.props);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        ref={(ref) => this.canvas = ref}
        />
    )
  }

}
