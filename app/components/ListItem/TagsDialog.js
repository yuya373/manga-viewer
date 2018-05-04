import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import Autocomplete from './../Autocomplete.js';


const style = (theme) => ({
  input: {
    margin: theme.spacing.unit,
  },
  tags: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    padding: `${theme.spacing.unit}px 0`,
    minHeight: 40,
  },
  tag: {
    margin: `${theme.spacing.unit / 2}px`,
  },
  inputContainer: {
    display: "flex",
  },
  newTagInput: {
    marginTop: 0,
  },
});

class TagsDialog extends PureComponent {
  state = {
    newTagTextField: "",
  };

  handleSelect = (item) => this.addNewTag(item);
  handleTextFieldKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.addNewTag();
    }
  }

  handleTextFieldChange = (inputValue) => this.setState({
    newTagTextField: inputValue,
  });

  addNewTag = (tag = undefined) => {
    const newTag = tag || this.state.newTagTextField;
    if (newTag.length > 0) {
      this.props.addTag(newTag);
      this.setState({newTagTextField: ""});
    }
  }
  handleDeleteTag = (tag) => () => {
    this.props.deleteTag(tag);
  }

  renderTags = () => {
    const { classes, tags = [] } = this.props;
    if (tags.length < 1) return (
      <Typography variant="body1">
        No Tags
      </Typography>
    );

    return tags.map((e, i) => (
      <Chip
        className={classes.tag}
        key={i}
        label={e}
        onDelete={this.handleDeleteTag(e)}
        />
    ))
  };

  render() {
    const {
      classes,
      open,
      title,
      onClose,
      suggestions,
    } = this.props;
    const { newTagTextField } = this.state;
    const source = suggestions.map((e) => ({
      label: e,
    }));

    return (
      <Dialog
        open={open}
        onClose={onClose}
        >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tags
          </DialogContentText>
          <div className={classes.tags}>
            {this.renderTags()}
          </div>
          <div className={classes.inputContainer}>
            <Autocomplete
              className={classes.newTagInput}
              margin="dense"
              fullWidth={true}
              autoFocus={true}
              placeholder="Add New Tag"
              onSelect={this.handleSelect}
              onKeyDown={this.handleTextFieldKeyDown}
              onInputValueChange={this.handleTextFieldChange}
              value={newTagTextField}
              selectedItem={newTagTextField.length < 1 ? "" : undefined}
              source={source}
              />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(style)(TagsDialog);
