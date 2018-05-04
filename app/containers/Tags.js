import { connect } from 'react-redux';
import {
  gotoTag,
} from './../actions/tag.js';
import Tags from './../components/Tags.js';

function mapStateToProps(state) {
  const tags = state.tag.tags;

  return {
    tags: Object.keys(tags).map((e) => ({
      label: e,
      count: tags[e].length,
    })),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoTag: (tag) => dispatch(gotoTag(tag)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
