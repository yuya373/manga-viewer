import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

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
  },
  tag: {
    margin: `${theme.spacing.unit / 2}px`,
  },
});

class TagsDialog extends PureComponent {
  state = {
    newTagTextField: "",
  };

  handleTextFieldKeyDown = (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      event.preventDefault();
      this.addNewTag();
    }
  }

  handleTextFieldChange = (e) => this.setState({
    newTagTextField: e.target.value,
  });

  addNewTag = () => {
    const newTag = this.state.newTagTextField;
    if (newTag.length > 0) {
      this.props.onAddTag(newTag);
      this.setState({newTagTextField: ""});
    }
  }
  handleDeleteTag = (tag) => () => {
    this.props.onDeleteTag(tag);
  }

  renderTags = () => {
    const { classes, tags = [] } = this.props;
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
    } = this.props;

    const { newTagTextField } = this.state;

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
          <TextField
            margin="dense"
            autoFocus={true}
            fullWidth={true}
            label="Add New Tag"
            onKeyDown={this.handleTextFieldKeyDown}
            onChange={this.handleTextFieldChange}
            value={newTagTextField}
            />
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(style)(TagsDialog);
