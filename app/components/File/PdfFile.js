import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Grid from 'material-ui/Grid';

class PdfFile extends Component {
  webviewRef = null;
  eventToScrollBy = (event) => {
    const {key, keyCode} = event;
    switch(keyCode) {
    case 40: // ArrowDown
    case 74: // J
      return 100;
    case 68: // D
      return window.innerHeight / 3;


    case 38: // ArrowUp
    case 75: // K
      return -100;
    case 85: // U
      return -(window.innerHeight / 3);
    }
  };

  handleKeyUp = (event) => {
    event.preventDefault();
    const dom = ReactDOM.findDOMNode(this.webviewRef)
    // console.log("EVENT", event);
    const by = this.eventToScrollBy(event);
    if (by) {
      dom.executeJavaScript(`scrollBy(0, ${by})`)
    }
  };

  componentDidMount() {
    this.webviewRef.focus();
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  render() {
    const {file} = this.props;
    const src = `file://${file.path}`;

    return (
      <Grid item xs={12}>
        <webview
          ref={(ref) => this.webviewRef = ref}
          src={src}
          plugins="true"
          style={{
            height: window.innerHeight,
          }}
          />
      </Grid>
    )
  }
}

export default PdfFile;
