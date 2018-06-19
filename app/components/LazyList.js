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
  gotoNextPage = () => {
    const {
      gotoPage, files, directories,
      page, maxPage,
    } = this.props;
    const nextPage = Math.min(maxPage, page + 1);

    if (page !== nextPage) {
      gotoPage(nextPage);
    }
  }
  onClickListItem = () => {
    const { gotoPage, page } = this.props;
    gotoPage(page);
  }
  onDisplay = ({isLastItem}) => {
    if (isLastItem) {
      return this.gotoNextPage;
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
          onClick={this.onClickListItem}
          onDisplay={this.onDisplay(file)}
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
          onClick={this.onClickListItem}
          onDisplay={this.onDisplay(dir)}
          />
      </React.Fragment>
    );
  };

  restoreScrollY = (scrollY) => {
    window.scrollTo(0, scrollY);
  }

  getItems({directories, files, page, perPage}) {
    const items = directories.concat(files).
          slice(0, (page * perPage));

    const _files = [];
    const _directories = [];

    const lastIndex = items.length - 1;
    items.forEach((e, i) => {
      if (e.isFile) {
        _files.push({
          ...e,
          isLastItem: i === lastIndex,
        });
      } else {
        _directories.push({
          ...e,
          isLastItem: i === lastIndex,
        });
      }
    })

    return {
      files: _files,
      directories: _directories,
    };
  }

  constructor(props) {
    super(props);

    const { files, directories } = this.getItems(props);

    this.state = {
      files,
      directories,
    };
  }

  componentDidMount() {
    const { scrollY } = this.props;
    console.log("componentDidMount", "scrollY", scrollY);
    this.restoreScrollY(scrollY);
  }

  componentDidUpdate(prevProps) {
    const { location, scrollY } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      console.log("componentDidUpdate", "scrollY", scrollY);
      this.restoreScrollY(scrollY);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page) {
      const { files, directories } = this.getItems(nextProps);
      this.setState({
        files,
        directories,
      });
    }
  }

  render() {
    const {
      files, directories,
    } = this.state;

    return (
      <List>
        {files.map(this.renderFile)}
        {directories.map(this.renderDirectory)}
      </List>
    );
  }
}
