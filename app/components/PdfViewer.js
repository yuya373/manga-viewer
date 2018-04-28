import React, { Component } from 'react';
// const { BrowserWindow } = require('electron').remote;
import Grid from 'material-ui/Grid';

export default class PdfViewer extends Component {
  constructor(props) {
    super(props);
    this.webviewRef = null;
  }

  componentDidMount() {
    // const {path} = this.props.file;
    // const win = new BrowserWindow({
    //   width: 800,
    //   height: 600,
    //   webPreferences: {
    //     nodeIntegration: false,
    //     sandbox: false,
    //     webSecurity: false,
    //     plugins: true,

    //   },
    // })

    // const file = `file://${path}`;

    // console.log("file", file);
    // // window.location.href = file;
    // win.loadURL(file);
    this.props.onLoad(this.webviewRef);
  }

  // componentWillReceiveProps(nextProps) {
  // if (nextProps.inputEvent) {
  // this.webviewRef.sendInputEvent(nextProps.inputEvent);
  // }
  // }

  // shouldComponentUpdate() {
  // return false;
  // }

  render() {
    const {path} = this.props.file;
    // const handleSourceError = (error) =>
    //       console.error('Error while retreiving document source! ' + error.message);
    // const handleSourceSuccess = () =>
    //       console.log("Source Loaded.")
    // const handleLoadError = (error) =>
    //       console.error('Error while loading document! ' + error.message)
    // const handleLoadSuccess = (pdf) =>
    //       console.log('Loaded a file with ' + pdf.numPages + ' pages!')

    // const file = require('fs').readFileSync(path).toString("base64");
    // console.log("FILE", path);
    // const dataURL = `data:application/pdf;base64,${file}`;

    const file = `file://${path}`;
    return (
      <Grid item xs={12}>
        <webview
          ref={(ref) => this.webviewRef = ref}
          src={file}
          plugins="true"
          style={{
            height: window.innerHeight,
          }}
          />
      </Grid>
    )
  }
}
