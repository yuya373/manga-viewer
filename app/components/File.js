import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';


const styles = theme => ({
});

class File extends Component {
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

    return (
      <React.Fragment>
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
