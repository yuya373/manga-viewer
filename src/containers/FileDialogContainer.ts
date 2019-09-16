import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../reducers';
import {
  closeFileDialog,
  fileDialogHideAppBar,
  fileDialogDisplayAppBar,
  deleteFileFromDialog,
} from '../actions/fileDialog';
import FileDialog, { Props } from '../components/FileDialog';
import { fetchImages } from '../actions/file';
import { toggleFavorite } from '../actions/favorite';

const mapStateToProps = (state: RootState): Props => {
  const { isOpen, name, path, isAppBarHidden } = state.fileDialog;
  const fullpath = join(path, name);
  const isLoading = Boolean(state.files.isLoading[fullpath]);
  const isFavorite = Boolean(state.favorites.byPath[fullpath]);

  return {
    isOpen,
    isLoading,
    isAppBarHidden,
    path,
    name,
    isFavorite,
  };
};

const mapDispatchToProps = {
  onClose: closeFileDialog,
  fetchImages,
  onMouseOver: fileDialogHideAppBar,
  onMouseLeave: fileDialogDisplayAppBar,
  onPressFavorite: toggleFavorite,
  onPressDelete: deleteFileFromDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDialog);
