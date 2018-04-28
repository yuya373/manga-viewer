import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Grid from 'material-ui/Grid';

class PdfFile extends Component {
  webviewRef = null;

  propergateToPdf(event) {
    if (this.webviewRef) {
      const dom = ReactDOM.findDOMNode(this.webviewRef)
      console.log("DOM", dom);
      const params = {
        type: "keyUp",
        keyCode: event.key.replace("Arrow", ""),
      };
      console.log("PARAM", params);
      dom.sendInputEvent(params);
    }
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
