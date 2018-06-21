import { connect } from 'react-redux';
import queryString from 'query-string';
import { push } from 'react-router-redux';
import LazyList from './../components/LazyList.js';


const perPage = 20;

function mapStateToProps(
  state,
  props,
) {
  const {
    directory, files, directories,
    location,
  } = props;


  const itemsCount = files.length + directories.length;
  const maxPage = Math.ceil(itemsCount / perPage);
  const minPage = 1;

  const queryParams = queryString.parse(location.search);
  const page = queryParams.page ?
        Number.parseInt(queryParams.page) : minPage;
  const scrollY = queryParams.scrollY ?
        Number.parseInt(queryParams.scrollY) : 0;
  const searchQuery = state.search.query;

  return {
    page,
    scrollY,
    directory,
    maxPage,
    perPage,
    searchQuery,
    tags: state.tag.tags,
    files,
    directories,
  }
}

function mapDispatchToProps(dispatch, props) {
  const { location } = props;
  const { pathname } = location;
  return {
    gotoPage: (page) => {
      console.log("gotoPage", page, window.scrollY);
      const param = queryString.stringify({
        page,
        scrollY: window.scrollY,
      });
      dispatch(push(`${pathname}?${param}`));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyList);
