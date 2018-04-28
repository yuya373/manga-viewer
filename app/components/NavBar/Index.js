import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';

const styles = theme => ({
  title: {
    flex: 1,
  },
  backButton: {
    color: "inherit",
    marginLeft: -(theme.spacing.unit * 1),
    marginRight: theme.spacing.unit * 2,
    menuAnchor: null,
  },
});

function NavBar({
  classes, title, visible,
  handleClickBack,
  menu,
}) {
  return (
    <Slide direction="down" in={visible} >
      <AppBar>
        <Toolbar >
          <IconButton
            onClick={handleClickBack}
            className={classes.backButton}
            aria-label="Back"
            >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            className={classes.title}
            variant="title"
            color="inherit"
            >
            {title}
          </Typography>
          {menu}
        </Toolbar>
      </AppBar>
    </Slide>
  )
}

export default withStyles(styles)(NavBar);
