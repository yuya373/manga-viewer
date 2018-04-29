import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import File from './../../components/File/Index.js';
import { push } from 'react-router-redux';
import * as actions from './../../actions/file.js';

function mapStateToProps(state, {match, location}) {
  const name = match.params.name;
  const qs = queryString.parse(location.search);
  const path = qs.path

  const directory = state.directory.directories.
        find((e) => e.path === path);
  const file = directory &&
        directory.files.find((e) => name === e.name);

  return {
    directory,
    file,
    perPage: state.file.perPage,
    loading: state.file.loading,
  }
}

function mapDispatchToProps(dispatch, {location}) {
  const qs = queryString.parse(location.search);
  const backTo = qs.backTo;
  return {
    ...bindActionCreators(actions, dispatch),
    gotoDirectory: (directory) =>
      dispatch(push(`/directories${directory.path}`)),
    ...(backTo ? {goBack: () => dispatch(push(backTo))} : {}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(File);
