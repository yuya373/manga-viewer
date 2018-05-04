import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Tag from './../components/Tag.js';

function mapStateToProps(state, { match }) {
  const tag = match.params.tag;
  const taggedFiles = state.tag.tags[tag] || [];
  const files = [];

  state.directory.directories.forEach((e) => {
    e.files.forEach((f) => {
      if (taggedFiles.includes(f.path)) {
        files.push({...f, directory: e});
      }
    })
  });

  return {
    tag,
    files,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(push("/tags")),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
