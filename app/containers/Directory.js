import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push, goBack } from 'react-router-redux';
import Directory from './../components/Directory.js';
import * as actions from './../actions/directory.js';
import { fileFavoriteChanged } from './../actions/file.js';
import queryString from 'query-string';

function mapStateToProps(state, { match }) {
  return {
    loading: state.directory.loading,
    path: match.params.path || "",
    directory: state.directory.directories.
      find((e) => e.path === `/${match.params.path || ""}`),
    error: state.directory.error,
    favoriteDirectories: state.favorite.directories,
    favoriteFiles: state.favorite.files,
  };
}

function mapDispatchToProps(dispatch, {location}) {
  const qs = queryString.parse(location.search);
  const backTo = qs.backTo;
  return {
    ...bindActionCreators(
      {
        ...actions,
        fileFavoriteChanged,
      },
      dispatch
    ),
    ...(backTo ? {goBack: () => dispatch(push(backTo))} : {}),
    onClickFile: (file, directory) =>
      dispatch(push(`/files/${file.name}?path=${directory.path}`))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);
