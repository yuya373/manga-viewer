import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Tag from './../components/Tag.js';
import F from './../models/file.js';
import D from './../models/directory.js';

function mapStateToProps(state, { match }) {
  const tag = match.params.tag;
  const taggedFiles = state.tag.tags[tag] || [];
  const files = [];

  taggedFiles.forEach((path) => {
    const splitted = path.split("/");
    const parent = D.create(
      splitted.slice(0, splitted.length - 1).join("/"),
      {}
    );
    const file = F.create(path, {});
    files.push({
      ...file,
      parent,
    });
  })

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
