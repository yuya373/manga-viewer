import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../app';
import {
  closeFileDialog,
  fileDialogHideAppBar,
  fileDialogDisplayAppBar,
} from '../actions/fileDialog';
import FileDialog, { Props } from '../components/FileDialog';
import { toggleFavorite } from '../actions/favorite';
import { fetchImages } from '../features/files/filesSlice';

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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDialog);
