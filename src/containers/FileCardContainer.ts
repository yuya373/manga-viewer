import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../reducers';
import FileCard, {
  Props,
  StateProps,
  DispatchProps,
} from '../components/FileCard';
import { openFileDialog } from '../actions/fileDialog';
import { fetchThumbnail, deleteFile } from '../actions/file';
import { toggleFavorite } from '../actions/favorite';

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => {
  const { path, name } = ownProps;
  const fullpath = join(path, name);
  const thumbnail = state.thumbnails.byPath[fullpath];
  const isFavorite = Boolean(state.favorites.byPath[fullpath]);
  const isDeleting = Boolean(state.files.isDeleting[fullpath]);

  return {
    thumbnail,
    isFavorite,
    isDeleting,
  };
};

const mapDispatchToProps: DispatchProps = {
  fetchThumbnail,
  onPress: openFileDialog,
  onPressFavorite: toggleFavorite,
  onPressDelete: deleteFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileCard);
