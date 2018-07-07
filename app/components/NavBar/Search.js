import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  input: {
    color: "inherit",
  },
  inputUnderline: {
    '&:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    '&:after': {
      backgroundColor: theme.palette.primary.contrastText,
    },
    '&:hover:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.87) !important',
      height: `1px !important`,
    },
  },
  clearButton: {
    cursor: "pointer",
  },
  clearIcon: {
    fontSize: 18,
  },
});

class Search extends PureComponent {
  inputRef = null;
  state = {
    displayInput: false,
    displayButton: true,
    query: "",
  };
  handleChange = (event) => this.setState({
    query: event.target.value,
  });
  handleKeyDown = (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      console.log("handleKeyDown", this.state.query);
      this.props.searchQueryChanged({query: this.state.query});
      this.inputRef.blur();
    }
  }
  handleClickIcon = () => this.setState({
    displayInput: true,
    displayButton: false,
  });
  handleBlur = () => this.setState((state) => ({
    displayInput: state.query.length > 0,
  }));
  handleEnter = () => this.inputRef.focus();
  handleExit = () => this.setState({displayButton: true});
  handleClickClear = () => this.setState({
    query: "",
    displayInput: false,
    displayButton: true,
  }, () => this.props.searchQueryChanged({query: ""}));

  render() {
    const { classes } = this.props;
    const { displayInput, displayButton, query } = this.state;

    const button = displayButton ? (
      <IconButton
        color="inherit"
        onClick={this.handleClickIcon}
        >
        <SearchIcon />
      </IconButton>
    ) : null;

    const startAdornment = displayInput ? (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ) : null;

    const endAdornment = displayInput && query.length > 0 ? (
      <InputAdornment
        className={classes.clearButton}
        onClick={this.handleClickClear}
        position="end"
        >
        <ClearIcon
          className={classes.clearIcon}
          />
      </InputAdornment>
    ) : (
      <InputAdornment position="end">
        <div style={{minWidth: 18}}/>
      </InputAdornment>
    );

    const style = {
      ...(displayInput ? {width: ""} : {width: 0}),
    };

    return (
      <React.Fragment>
        {button}
        <Fade
          style={style}
          in={displayInput}
          onEnter={this.handleEnter}
          onExit={this.handleExit}
          >
          <FormControl>
            <Input
              value={query}
              inputRef={(ref) => this.inputRef = ref}
              onBlur={this.handleBlur}
              classes={{underline: classes.inputUnderline}}
              className={classes.input}
              onKeyDown={this.handleKeyDown}
              onChange={this.handleChange}
              startAdornment={startAdornment}
              endAdornment={endAdornment}
              />
          </FormControl>
        </Fade>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Search);
