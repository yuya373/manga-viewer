import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import queryString from 'query-string';
import { subscribe } from 'subscribe-ui-event';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';

const perPage = 15;

export default class LazyList extends PureComponent {
  gotoPrevPage = (onPageChange) => () => {
    const { gotoPage, page, minPage } = this.props;
    const prevPage = Math.max(minPage, page - 1);
    if (page !== prevPage) {
      if (onPageChange) onPageChange();
      gotoPage(prevPage);
    }
  }
  gotoNextPage = (onPageChange) => () => {
    const {
      gotoPage, files, directories,
      page, maxPage,
    } = this.props;
    const nextPage = Math.min(maxPage, page + 1);

    if (page !== nextPage) {
      if (onPageChange) onPageChange();
      gotoPage(nextPage);
    }
  }
  renderFile = (file) => {
    const { directory, queryParams } = this.props;

    return (
      <React.Fragment key={file.path} >
        <FileListItem
          file={file}
          directory={directory || file.parent}
          queryParams={queryParams}
          />
      </React.Fragment>
    );
  }
  renderDirectory = (dir) => {
    const { queryParams } = this.props;
    return (
      <React.Fragment key={dir.path} >
        <DirectoryListItem
          directory={dir}
          queryParams={queryParams}
          />
      </React.Fragment>
    );
  };

  scrollHandler = null;
  handleScroll = (e, payload) => {
    const { delta, top } = payload.scroll;
    const offSet = 100;

    if (delta < 0) {
      if (top <= offSet) {
        this.gotoPrevPage(() => window.scrollBy(0, 1))();
      }
    } else {
      if (top >= (document.body.clientHeight - window.innerHeight - offSet)) {
        this.gotoNextPage(() => window.scrollBy(0, -1))();
      }
    }
  }

  componentDidMount() {
    this.scrollHandler = subscribe("scroll", this.handleScroll, {
      useRAF: true,
      enableScrollInfo: true,
    });
  }

  componentWillUnmount() {
    if (this.scrollHandler) {
      this.scrollHandler.unsubscribe();
    }
  }

  render() {
    const {
      files, directories,
    } = this.props;

    return (
      <List>
        {files.map(this.renderFile)}
        {directories.map(this.renderDirectory)}
      </List>
    );
  }
}
