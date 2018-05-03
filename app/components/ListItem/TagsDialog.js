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
          <div className={classes.inputContainer}>
            <Input
              className={classes.newTagInput}
              margin="dense"
              fullWidth={true}
              autoFocus={true}
              placeholder="Add New Tag"
              onKeyDown={this.handleTextFieldKeyDown}
              onChange={this.handleTextFieldChange}
              value={newTagTextField}
              />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(style)(TagsDialog);
