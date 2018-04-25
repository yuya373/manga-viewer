import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
});

class File extends Component {
  componentDidMount() {
    const {file, directory, loadFile} = this.props;
    if (file && directory) {
      loadFile(file, directory);
    }
    console.log("componentDidMount")
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps")
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

    return (
      <React.Fragment>
        <Grid item xs={12}>
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
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(File);
