import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Canvas from './Canvas.js';

const styles = theme => ({
});

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // perPage: 2,
      perPage: 1,
      index: 0,
      width: null,
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
  }

  componentDidMount() {
    const {file, directory, loadFile} = this.props;
    if (file && directory) {
      loadFile(file, directory);
    }
    document.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.updateWidth);
    this.updateWidth();
  }

  updateWidth() {
    if (this.gridRef) {
      const el = ReactDOM.findDOMNode(this.gridRef);
      const {width} = el.getBoundingClientRect();
      this.setState({width});
    }
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp)
  }

  handleKeyUp(event) {
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
      if (keyCode === 37) {
        this.nextPage();
      }
      if (keyCode === 39) {
        this.prevPage();
      }
    }
  }

  nextPage() {
    const {file} = this.props;
    const {index, perPage} = this.state;
    const nextIndex = Math.min(index + perPage, (file.images.length - 1));
    this.setState({index: nextIndex});
  }

  prevPage() {
    const {index, perPage} = this.state;
    const nextIndex = Math.max(0, index - perPage);
    this.setState({index: nextIndex});
  }

  renderImages() {
    const {index, width, perPage} = this.state;
    const {classes, file} = this.props;

    const images = file.images.slice(index, index + perPage).reverse();
    const imageWidth = width / perPage
    const canvases = images.map((e, i) => (
      <Grid item xs={12 / perPage} key={i} >
        <Canvas
          base64={e.base64}
          name={e.name}
          width={imageWidth}
          height={window.innerHeight}
          />
      </Grid>
    ))

    return (
      <Grid container className={classes.root} spacing={0}>
        {canvases}
      </Grid>
    )
  }

  render() {
    const {file, directory} = this.props;

    if (!file && directory) {
      return (
        <Redirect to={`/directories${directory.path}`}/>
      )
    }

    if (!file || !directory) {
      return <Redirect to="/" />
    }

    const handleClickBack = () => {
      this.props.gotoDirectory(directory);
    }

    const handleRef = (ref) => this.gridRef = ref;

    return (
      <React.Fragment>
        <Grid item xs={12} ref={handleRef} />
        <Grid item xs={12} >
          <Button
            color="primary"
            onClick={handleClickBack}
            >
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          {directory.path}
        </Grid>
        <Grid item xs={12}>
          {file.name}
        </Grid>
        {this.renderImages()}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(File);
