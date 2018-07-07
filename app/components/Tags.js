import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import NavBar from './../containers/NavBar/Index.js';

const styles = (theme) => ({
  tags: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
  },
  tag: {
    margin: theme.spacing.unit,
  },
});

function Tags({
  classes,
  tags,
  gotoTag,
}) {
  const renderTag = ({ label, count }, i) => (
    <Chip
      className={classes.tag}
      key={i}
      label={label}
      avatar={<Avatar>{count}</Avatar>}
      onClick={() => gotoTag(label)}
      />
  );

  return (
    <React.Fragment>
      <NavBar
        title="Tags"
        visible={true}
        position="sticky"
        />
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <div className={classes.tags}>
            {tags.map(renderTag)}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(Tags);
