import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import NavBar from './../containers/NavBar/Index.js';
import LazyList from './LazyList.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});

class Favorite extends PureComponent {
  render() {
    const {
      classes,
      files,
      directories,
    } = this.props;

    return (
      <React.Fragment>
        <NavBar
          title="Favorites"
          visible={true}
          position="sticky"
          />
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <LazyList
              files={files}
              directories={directories}
              queryParams={{backTo: "/favorites"}}
              />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Favorite);
