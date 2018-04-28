import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
  }

  componentWillReceiveProps(nextProps) {
    this.loadImageToCanvas(nextProps);
  }

  componentDidMount() {
    this.loadImageToCanvas(this.props);
  }

  loadImageToCanvas({base64, name}) {
    const canvas = ReactDOM.findDOMNode(this.canvas);
    const image = new Image();
    image.onload = () => this.handleImageLoad(canvas, image);

    const extname = require('path').extname(name).substring(1);
    image.src = `data:image/${extname};base64,${base64}`;
  }

  handleImageLoad(canvas, image) {
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
    ctx.drawImage(image, 0, 0, w, h);
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
