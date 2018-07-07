import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { subscribe } from 'subscribe-ui-event';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default class LazyListItem extends PureComponent {
  scrollHandler = null;
  listItemRef = null;
  handleScroll = () => {
    const el = ReactDOM.findDOMNode(this.listItemRef);
    const { top } = el.getBoundingClientRect();
    const {
      onDisplay,
    } = this.props;
    if (top <= window.innerHeight) {
      onDisplay();
      this.unsubscribe();
    }
  }
  unsubscribe = () => {
    if (this.scrollHandler) {
      this.scrollHandler.unsubscribe();
      this.scrollHandler = null;
    }
  }

  componentDidMount() {
    if (this.props.onDisplay) {
      this.scrollHandler = subscribe("scroll", this.handleScroll, {
        useRAF: true,
      });
      this.handleScroll();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      onClick,
      classes,
      children,
      button,
    } = this.props;

    return (
      <ListItem
        ref={(ref) => this.listItemRef = ref}
        button={button}
        onClick={onClick}
        classes={classes}
        >
        {children}
      </ListItem>
    )
  }
}
