import { connect } from 'react-redux';
import Thumbnail from './../../components/ListItem/Thumbnail.js';
import {
  fileThumbnailUrlNotReady,
} from './../../actions/file.js';

function mapStateToProps(state, {
  isScrolling,
  file,
}) {
  const isThumbnailUrlReady = !!state.file.thumbnailUrls[file.path];

  return {
    file,
    isScrolling,
    isThumbnailUrlReady,
  };
}

function mapDispatchToProps(dispatch, {
  file,
}) {
  return {
    thumbnailUrlNotReady: () =>
      dispatch(fileThumbnailUrlNotReady(file.path)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thumbnail);
