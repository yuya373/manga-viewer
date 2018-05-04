import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

const styles = theme => console.log("theme",theme) || ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'fixed',
    zIndex: theme.zIndex.modal + 1,
    marginTop: theme.spacing.unit,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
      />
  );
}

function renderSuggestion({
  suggestion, index, itemProps, highlightedIndex, selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
      >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(inputValue, suggestions) {
  let count = 0;
  return suggestions.filter(suggestion => {
    const keep =
          (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
          count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

class Autocomplete extends PureComponent {
  inputRef = null;
  handleInputRef = (ref) => this.inputRef = ref;
  state = {
    inputWidth: null,
  };
  updateInputWidth = () => {
    const dom = ReactDOM.findDOMNode(this.inputRef);
    const { width } = dom.getBoundingClientRect();
    if (this.state.inputWidth !== width) {
      this.setState({inputWidth: width});
    }
  }

  componentDidMount() {
    this.updateInputWidth();
  }

  render() {
    const {
      classes,
      placeholder,
      margin,
      autoFocus,
      fullWidth,
      onSelect,
      onKeyDown,
      onInputValueChange,
      value,
      selectedItem,
      source,
    } = this.props;
    const { inputWidth } = this.state;

    const suggestion = (
      isOpen,
      inputValue, getItemProps, highlightedIndex, selectedItem,
    ) => (inputValue.length <= 0 || !isOpen) ? null : (
      <Paper
        className={classes.paper} square
        style={{width: inputWidth}}
        >
        {
          getSuggestions(inputValue, source).map((suggestion, index) => renderSuggestion({
            suggestion,
            index,
            itemProps: getItemProps({ item: suggestion.label }),
            highlightedIndex,
            selectedItem,
          }))
        }
      </Paper>
    );

    return (
      <Downshift
        onChange={(item, s) => console.log("onChange", item, s)}
        onSelect={onSelect}
        onInputValueChange={(inputValue) => onInputValueChange(inputValue)}
        inputValue={value}
        selectedItem={selectedItem}
        >
        {({
          getInputProps, getItemProps, isOpen,
          inputValue, selectedItem, highlightedIndex
          }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                margin,
                autoFocus,
                onKeyDown: (e) => highlightedIndex === null && onKeyDown(e),
                value,
                classes,
                InputProps: getInputProps({
                  placeholder,
                }),
                ref: this.handleInputRef,
              })}
              {
                suggestion(
                  isOpen,
                  inputValue, getItemProps, highlightedIndex, selectedItem,
                )
              }
            </div>
          )}
      </Downshift>
    );
  }

}

export default withStyles(styles)(Autocomplete);
