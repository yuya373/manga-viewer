import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push, goBack } from 'react-router-redux';
import Directory from './../components/Directory.js';
import * as actions from './../actions/directory.js';
import queryString from 'query-string';

function mapStateToProps(state, { match }) {
  const path = decodeURIComponent(match.params.path || "");
  console.log("PATH: ", path);
  const directory = state.directory.directories.
        find((e) => e.path === path) || {};
  return {
    loading: state.directory.loading,
    path: match.params.path || "",
    directory,
    sort: state.sort,
  };
}

function mapDispatchToProps(dispatch, {location}) {
  const qs = queryString.parse(location.search);
  const backTo = qs.backTo;
  return {
    ...bindActionCreators(actions, dispatch),
    ...(backTo ?
        {goBack: () => dispatch(push(backTo))} :
        {goBack: () => dispatch(goBack())}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);
