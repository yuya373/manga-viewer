import { connect } from 'react-redux';
import queryString from 'query-string';
import { push } from 'react-router-redux';
import LazyList from './../components/LazyList.js';


const perPage = 15;

const sliceItems = (page, items) => {
  const beg = page * perPage;
  const end = beg + perPage;
  return items.slice(beg, end);
}

const getItems = (page, files, directories) => {
  const allItems = files.concat(directories);
  const prevPageItems = page - 1 < 0 ? [] :
        sliceItems(page - 1, allItems);
  const currentPageItems = sliceItems(page, allItems);
  const nextPageItems = sliceItems(page + 1, allItems);
  const items = prevPageItems.
        concat(currentPageItems).
        concat(nextPageItems);

  const filesToRender = [];
  const directoriesToRender = [];
  items.forEach((e, i) => {
    if (e.isFile) {
      filesToRender.push(e);
    } else {
      directoriesToRender.push(e);
    }
  })

  return {
    files: filesToRender,
    directories: directoriesToRender,
  }
}

function mapStateToProps(
  state,
  props,
) {
  const {
    directory, files, directories,
    location,
  } = props;

  const queryParams = queryString.parse(location.search);
  const page = queryParams.page ?
        Number.parseInt(queryParams.page) : 1;

  const itemsCount = files.length + directories.length;
  const maxPage = Math.ceil(itemsCount / perPage);

  return {
    page,
    directory,
    maxPage,
    ...getItems(page, files, directories),
  }
}

function mapDispatchToProps(dispatch, props) {
  const { location } = props;
  const { pathname } = location;
  return {
    gotoPage: (page) => {
      console.log("gotoPage", page);
      const param = queryString.stringify({
        page,
      });
      dispatch(push(`${pathname}?${param}`));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyList);
