import React, {PureComponent} from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
  title: {
    flex: 1,
  },
  menuButton: {
    color: "inherit",
    marginLeft: -(theme.spacing.unit * 1),
    marginRight: theme.spacing.unit * 2,
  },
});

class NavBar extends PureComponent {
  renderBackButton = () => {
    const {
      classes,
      onClickBack,
    } = this.props;

    if ((typeof onClickBack) !== 'function')
      return null;

    return (
      <IconButton
        onClick={onClickBack}
        className={classes.menuButton}
        aria-label="Back"
        >
        <ArrowBackIcon />
      </IconButton>
    );
  }

  render() {
    const {
      classes, title, visible,
      menu,
      position,
      isDrawerOpen,
      drawerOpen,
    } = this.props;

    return (
      <React.Fragment>
        <Slide direction="down" in={visible} >
          <AppBar position={position}>
            <Toolbar >
              {this.renderBackButton()}
              <Typography
                className={classes.title}
                variant="title"
                color="inherit"
                >
                {title}
              </Typography>
              {menu}
              <IconButton
                color="inherit"
                onClick={drawerOpen}
                aria-label="Menu"
                >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Slide>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NavBar);
