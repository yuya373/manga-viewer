import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../reducers';
import DeleteButton, { StateProps } from '../components/DeleteButton';
import { deleteFile } from '../actions/file';

type OwnProps = {
  path: string;
  name: string;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  const { path, name } = ownProps;
  const fullpath = join(path, name);
  const isDeleting = Boolean(state.files.isDeleting[fullpath]);

  return {
    path: fullpath,
    isDeleting,
  };
};

const mapDispatchToProps = {
  onPress: deleteFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButton);
