import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../reducers';
import {
  closeFileDialog,
  fileDialogHideAppBar,
  fileDialogDisplayAppBar,
} from '../actions/fileDialog';
import FileDialog, { Props } from '../components/FileDialog';
import { fetchImages } from '../actions/file';

const mapStateToProps = (state: RootState): Props => {
  const { isOpen, name, path, isAppBarHidden } = state.fileDialog;
  const fullpath = join(path, name);
  const isLoading = Boolean(state.files.isLoading[fullpath]);

  return {
    isOpen,
    isLoading,
    isAppBarHidden,
    path,
    name,
  };
};

const mapDispatchToProps = {
  onClose: closeFileDialog,
  fetchImages,
  onMouseOver: fileDialogHideAppBar,
  onMouseLeave: fileDialogDisplayAppBar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDialog);
