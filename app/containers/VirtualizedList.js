import { connect } from 'react-redux';
import queryString from 'query-string';
import { push } from 'react-router-redux';
import VirtualizedList from './../components/VirtualizedList.js';

function mapStateToProps(
  state,
  props,
) {
  const {
    files, directories,
  } = props;

  const searchQuery = state.search.query;

  return {
    searchQuery,
    tags: state.tag.tags,
    items: files.concat(directories),
  }
}

function mapDispatchToProps(dispatch, props) {
  const { location } = props;
  const { pathname } = location;
  return {
    gotoIndex: (i) => {
      const param = queryString.stringify({
        index: i,
      });
      dispatch(push(`${pathname}?${param}`));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VirtualizedList);
