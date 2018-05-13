import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import List, {
  ListItem,
} from 'material-ui/List';

export default class LazyListItem extends Component {
  detectInView = () => {
    const { onDisplay } = this.props;
    if (onDisplay) {
      const el = ReactDOM.findDOMNode(this.listItemRef);
      const { top } = el.getBoundingClientRect();

      if (window.innerHeight >= top) {
        this.deregisterDetectInView();
        onDisplay();
      }
    }
  }

  deregisterDetectInView = () => {
    window.removeEventListener("scroll", this.detectInView);
  }

  registerDetectInView = () => {
    window.addEventListener("scroll", this.detectInView);
  }


  componentDidMount() {
    this.registerDetectInView();
    this.detectInView();
  }

  componentWillUnmount() {
    this.deregisterDetectInView();
  }

  render () {
    const {
      onClick,
      children,
      classes,
    } = this.props

    return (
      <ListItem
        ref={(ref) => this.listItemRef = ref}
        classes={classes}
        button
        onClick={onClick}
        >
        {children}
      </ListItem>
    );
  }
}
