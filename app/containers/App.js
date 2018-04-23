// @flow
import * as React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

type Props = {
  children: React.Node
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        {this.props.children}
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
