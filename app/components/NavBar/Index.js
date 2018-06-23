import React, {PureComponent} from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';
import MenuIcon from '@material-ui/icons/Menu';
import Search from './../../containers/NavBar/Search.js';
import Sort from './../../containers/NavBar/Sort.js';

const styles = theme => ({
  title: {
    flex: 1,
  },
  menuButton: {
    color: "inherit",
    marginLeft: -(theme.spacing.unit * 1),
    marginRight: theme.spacing.unit * 2,
  },
  disabledMenuButton: {
    opacity: 0,
  },
});

class NavBar extends PureComponent {
  renderBackButton = () => {
    const {
      classes,
      onClickBack,
      disableBackButton,
    } = this.props;

    if ((typeof onClickBack) !== 'function')
      return null;

    const className = classNames(
      classes.menuButton, {
        [classes.disabledMenuButton] : disableBackButton,
      }
    );
    return (
      <IconButton
        disabled={disableBackButton}
        onClick={onClickBack}
        className={className}
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
      hideSearch,
      hideSort,
    } = this.props;

    const search = hideSearch ? null : (<Search />);
    const sort = hideSort ? null : (<Sort />);

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
              {search}
              {sort}
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
