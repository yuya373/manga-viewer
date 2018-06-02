import React, { PureComponent } from 'react';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';

const perPage = 15;

export default class LazyList extends PureComponent {
  constructor(props) {
    super(props);
    const page = props.page || 0;
    this.state = {
      page,
      ...(this.getItems(page)),
    };
  }
  gotoNextPage = () => {
    const { gotoNextPage } = this.props;
    this.setState(
      (state) => {
        const nextPage = state.page + 1;

        return {
          ...state,
          page: nextPage,
          ...this.getItems(nextPage),
        }
      },
      () => gotoNextPage(this.state.page)
    )
  }
  onDisplay = ({isLastItem}) => () => isLastItem && this.gotoNextPage();
  renderFile = (file) => {
    const { directory, queryParams } = this.props;

    return (
      <React.Fragment key={file.path} >
        <FileListItem
          file={file}
          directory={directory || file.parent}
          onDisplay={this.onDisplay(file)}
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
          onDisplay={this.onDisplay(dir)}
          queryParams={queryParams}
          />
      </React.Fragment>
    );
  };
  getItems = (page) => {
    const {
      files, directories
    } = this.props;

    const beg = 0;
    const end = beg + (perPage * (page + 1));

    const items = files.concat(directories).slice(beg, end);
    const filesToRender = [];
    const directoriesToRender = [];
    items.forEach((e, i) => {
      const isLastItem = (items.length - 1) === i;
      if (e.isFile) {
        filesToRender.push({ ...e, isLastItem });
      } else {
        directoriesToRender.push({ ...e, isLastItem });
      }
    })

    return {
      files: filesToRender,
      directories: directoriesToRender,
    }
  }
  enqueueItems = () => {
    this.setState((state) => ({
      ...state,
      ...this.getItems(state.page),
    }));
  }

  render() {
    const {
      files, directories,
    } = this.state;

    return (
      <List>
        <ListSubheader disableSticky={true} >
          Files
        </ListSubheader>
        {files.map(this.renderFile)}
        <ListSubheader disableSticky={true} >
          Directories
        </ListSubheader>
        {directories.map(this.renderDirectory)}
      </List>
    );
  }
}
