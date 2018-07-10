import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { subscribe } from 'subscribe-ui-event';
import { List } from 'react-virtualized';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';

const typographyProps = {
  noWrap: true,
};

export default class VirtualizedList extends PureComponent {
  state = {
    height: 0,
    width: 0,
  };
  rowRenderer = ({
    index,
    key,
    style,
    isScrolling, isVisible,
    parent,
  }) => {
    const {
      items,
      queryParams,
      directory,
    } = this.props;

    const item = items[index];

    const content = item.isFile ? (
      <FileListItem
        component="div"
        file={item}
        directory={directory || file.parent}
        queryParams={queryParams}
        primaryTypographyProps={typographyProps}
        isScrolling={isScrolling || !isVisible}
        />
    ) : (
      <DirectoryListItem
        component="div"
        directory={item}
        queryParams={queryParams}
        primaryTypographyProps={typographyProps}
        isScrolling={isScrolling || !isVisible}
        />
    );

    return (
      <div
        key={key}
        style={style}
        >
        {content}
      </div>
    );
  }

  wrapperRef = null;

  getWrapperSize = () => {
    const el = ReactDOM.findDOMNode(this.wrapperRef);

    if (el) {
      return el.getBoundingClientRect();
    } else {
      return { width: 0, height: 0 };
    }
  }

  updateListSize = () => this.setState((prevState) => {
    const {
      width,
      // height,
    } = this.getWrapperSize();

    const height = window.innerHeight - 64;

    if (prevState.width !== width || prevState.height !== height) {
      return { width, height };
    }

    return prevState;
  });

  resizeHandler = null;

  componentDidMount() {
    this.resizeHandler = subscribe("resize", this.updateListSize, {
      useRAF: true,
    })
    this.updateListSize();
  }

  componentWillUnmount() {
    if (this.resizeHandler) {
      this.resizeHandler.unsubscribe();
    }
  }

  handleRowsRendered = (event) =>
    console.log("handleRowsRendered", event);

  render() {
    const {
      items, tags, searchQuery, index,
    } = this.props;

    const {
      width, height,
    } = this.state;

    return (
      <div
        ref={(ref) => this.wrapperRef = ref}
        style={{ width: "100%", height: "100%" }}
        >
        <List
          height={height}
          width={width}
          rowCount={items.length}
          rowHeight={64}
          rowRenderer={this.rowRenderer}
          onRowsRendered={this.handleRowsRendered}
          />
      </div>
    )
  }
}
