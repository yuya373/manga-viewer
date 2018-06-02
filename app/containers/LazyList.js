import { connect } from 'react-redux';
import queryString from 'query-string';
import { push } from 'react-router-redux';
import LazyList from './../components/LazyList.js';


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
        Number.parseInt(queryParams.page) : undefined;

  return {
    page,
    directory,
    files,
    directories,
  }
}

function mapDispatchToProps(dispatch, props) {
  const { location } = props;
  const { pathname } = location;
  return {
    gotoNextPage: (nextPage) => {
      const param = queryString.stringify({
        page: nextPage,
      });
      dispatch(push(`${pathname}?${param}`));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyList);
