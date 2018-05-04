import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import FileListItem from './../containers/ListItem/FileListItem.js';
import NavBar from './../containers/NavBar/Index.js';

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
}) {
  const renderFile = (e, i) => (
    <React.Fragment key={e.path}>
      <FileListItem
        file={e}
        directory={e.directory}
        queryParams={{backTo: `/tags/${tag}`}}
        />
    </React.Fragment>
  );

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
          <List>
            {files.map(renderFile)}
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(Tag);
