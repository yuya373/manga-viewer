import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push, goBack } from 'react-router-redux';
import Directory from './../components/Directory.js';
import * as actions from './../actions/directory.js';
import { fileFavoriteChanged, gotoFile } from './../actions/file.js';
import queryString from 'query-string';
import {
  addTag,
  deleteTag,
} from './../actions/tag.js';

function mapStateToProps(state, { match }) {
  return {
    loading: state.directory.loading,
    path: match.params.path || "",
    directory: state.directory.directories.
      find((e) => e.path === `/${match.params.path || ""}`),
    error: state.directory.error,
    favoriteDirectories: state.favorite.directories,
    favoriteFiles: state.favorite.files,
    tags: state.tag.tags,
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
        gotoFile,
        addTag,
        deleteTag,
      },
      dispatch
    ),
    ...(backTo ? {goBack: () => dispatch(push(backTo))} : {}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);
