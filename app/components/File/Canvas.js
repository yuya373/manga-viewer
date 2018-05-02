import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Canvas extends Component {
  canval = null;
  image = null;

  loadImageToCanvas = ({image}) => {
    const name = image.name
    const ext = image.ext
    const pStart = performance.now();
    image.data.async("base64").then((base64) => {
      const pEnd = performance.now();
      console.log("Image: ", name, " Loaded: ", pEnd - pStart);
      const image = new Image();
      image.onload = this.renderImage;
      image.src = `data:image/${ext};base64,${base64}`;
      this.image = image;
    });
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
    ctx.drawImage(image, 0, 0, w, h);
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
