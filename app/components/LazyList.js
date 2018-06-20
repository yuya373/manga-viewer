import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import queryString from 'query-string';
import { subscribe } from 'subscribe-ui-event';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';


export default class LazyList extends PureComponent {
  gotoNextPage = () => {
    const {
      gotoPage, page, maxPage,
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
  onDisplay = (isLastItem) => {
    if (isLastItem) {
      return this.gotoNextPage;
    }
  }
  renderFile = (file, isLastItem) => {
    const { directory, queryParams } = this.props;

    return (
      <React.Fragment key={file.path} >
        <FileListItem
          file={file}
          directory={directory || file.parent}
          queryParams={queryParams}
          onClick={this.onClickListItem}
          onDisplay={this.onDisplay(isLastItem)}
          />
      </React.Fragment>
    );
  }
  renderDirectory = (dir, isLastItem) => {
    const { queryParams } = this.props;
    return (
      <React.Fragment key={dir.path} >
        <DirectoryListItem
          directory={dir}
          queryParams={queryParams}
          onClick={this.onClickListItem}
          onDisplay={this.onDisplay(isLastItem)}
          />
      </React.Fragment>
    );
  };

  renderItem = (item, isLastItem) => {
    if (item.isFile) {
      return this.renderFile(item, isLastItem);
    } else {
      return this.renderDirectory(item, isLastItem);
    }
  }

  restoreScrollY = (scrollY) => {
    window.scrollTo(0, scrollY);
  }

  paginateItems = ({items, page, perPage}) => {
    return items.slice(0, (page * perPage));
  }

  constructor(props) {
    super(props);

    this.state = {
      items: this.paginateItems(props),
    }
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
      this.setState({
        items: this.paginateItems(nextProps),
      });
    }
  }

  render() {
    const {
      items,
    } = this.state;
    const lastItemIndex = items.length - 1;
    console.log("lastItemIndex: ", lastItemIndex);

    return (
      <List>
        {items.map((e, i) => this.renderItem(e, i === lastItemIndex))}
      </List>
    );
  }
}
