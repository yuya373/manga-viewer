import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import FileListItem from './../containers/ListItem/FileListItem.js';
import NavBar from './../containers/NavBar/Index.js';
import LazyList from './../containers/LazyList.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});


function Tag({
  classes,
  tag,
  files,
  goBack,
  location,
}) {
  return (
    <React.Fragment>
      <NavBar
        title={tag}
        visible={true}
        position="sticky"
        onClickBack={goBack}
        />
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <LazyList
            location={location}
            files={files}
            directories={[]}
            queryParams={{backTo: `/tags/${tag}`}}
            />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(Tag);
