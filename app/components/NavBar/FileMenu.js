import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingIcon from '@material-ui/icons/Settings';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FavoriteButton from './../FavoriteButton.js';
import LabelIcon from '@material-ui/icons/Label';
import LabelOutlineIcon from '@material-ui/icons/LabelOutline';
import TagsDialog from './../../containers/ListItem/TagsDialog.js';

const styles = theme => ({
  menuItemControl: {
    paddingRight: theme.spacing.unit * 2,
    marginRight: 0,
  }
});

class FileMenu extends PureComponent {
  state = {
    menuAnchor: null,
  };

  handleMenuOpen = (e) => this.setState({menuAnchor: e.currentTarget});

  handleMenuClose = (e) => this.setState({menuAnchor: null});

  handlePerPageSwitch = (e) => {
    const {perPage, filePerPageChanged} = this.props;
    e.stopPropagation();
    e.preventDefault();
    filePerPageChanged(perPage === 2 ? 1 : 2);
    this.setState({menuAnchor: null});
  }

  handleClickFavorite = () => {
    const { favorite, file, fileFavoriteChanged } = this.props;
    fileFavoriteChanged({path: file.path, favorite: !favorite });
  }

  openTagsDialog = () => this.props.toggleTagsDialog();
  closeTagsDialog = () => this.props.toggleTagsDialog();


  render() {
    const {
      classes,
      perPage,
      favorite,
      tags,
      file,
      tagsDialogOpen,
    } = this.props;
    const { menuAnchor } = this.state;
    const perPageSwitch = (
      <Switch checked={perPage == 2}/>
    );

    const tagIcon = tags.length > 0 ?
          (<LabelIcon />) : (<LabelOutlineIcon />);

    return (
      <React.Fragment>
        <IconButton
          onClick={this.openTagsDialog}
          aria-label="Tags"
          color="inherit"
          >
          {tagIcon}
        </IconButton>
        <TagsDialog
          open={tagsDialogOpen}
          file={file}
          tags={tags}
          onClose={this.closeTagsDialog}
          />
        <FavoriteButton
          color="inherit"
          favorite={favorite}
          onClick={this.handleClickFavorite}
          />
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
          color="inherit"
          >
          <SettingIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClick={this.handleMenuClose}
          >
          <MenuItem onClick={this.handlePerPageSwitch} >
            <FormControlLabel
              className={classes.menuItemControl}
              control={perPageSwitch}
              label="Spread"
              />
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(FileMenu);
