import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push, goBack } from 'react-router-redux';
import Directory from './../components/Directory.js';
import * as actions from './../actions/directory.js';
import queryString from 'query-string';

function mapStateToProps(state, { match }) {
    const directory = state.directory.directories.
          find((e) => e.path === `/${match.params.path || ""}`) || {};
  return {
    loading: state.directory.loading,
    path: match.params.path || "",
    directory,
    files: directory.files || [],
    childDirectories: directory.childDirectories || [],
  };
}

function mapDispatchToProps(dispatch, {location}) {
  const qs = queryString.parse(location.search);
  const backTo = qs.backTo;
  return {
    ...bindActionCreators(actions, dispatch),
    ...(backTo ? {goBack: () => dispatch(push(backTo))} : {}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);
