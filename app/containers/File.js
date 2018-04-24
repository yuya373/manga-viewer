import { connect } from 'react-redux';
import queryString from 'query-string';
import File from './../components/File.js';

function mapStateToProps(state, {match, location}) {
  const name = match.params.name;
  const qs = queryString.parse(location.search);
  const path = qs.path

  console.log("qs", qs);

  const directory = state.directory.directories.
        find((e) => e.path === path);
  const file = directory.files.find((e) => name === e.name);

  return {
    directory,
    file,
  }
}

export default connect(mapStateToProps)(File);
