import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
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

  renderExistingTags = () => {
    const { classes, tags, suggestions } = this.props;
    const exitings = suggestions.filter((e) => !tags.includes(e))
    if (exitings.length <= 0) return null;

    const candidates = exitings.map((e) => (
      <Chip
        key={e}
        className={classes.tag}
        label={e}
        onClick={() => this.addNewTag(e)}
        />
    ));

    return (
      <React.Fragment>
        <DialogContentText>
          Existing Tags
        </DialogContentText>
        <div className={classes.tags}>
          {candidates}
        </div>
      </React.Fragment>
    )
  }

  renderDialogInner = () => {
    const {
      classes,
      open,
      title,
      onClose,
      suggestions,
    } = this.props;

    if (!open) return <div />;

    const { newTagTextField } = this.state;
    const source = suggestions.map((e) => ({
      label: e,
    }));
    const selectedItem = newTagTextField.length < 1 ? "" : undefined;

    return (
      <React.Fragment>
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
          {this.renderExistingTags()}
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
              selectedItem={selectedItem}
              source={source}
              />
          </div>
        </DialogContent>
      </React.Fragment>
    )
  }

  render() {
    const {
      open,
      onClose,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        >
        {this.renderDialogInner()}
      </Dialog>
    )
  }
}

export default withStyles(style)(TagsDialog);
