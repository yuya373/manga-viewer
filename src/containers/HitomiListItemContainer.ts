import { connect } from 'react-redux';
import { RootState } from '../reducers';
import HitomiListItem, { StateProps } from '../components/HitomiListItem';
import { openFileDialog } from '../actions/fileDialog';

type OwnProps = {
  url: string;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  const { url } = ownProps;

  return {
    isScraping: Boolean(state.hitomi.isScraping[url]),
    file: state.hitomi.fileByUrl[url],
    error: state.hitomi.errorByUrl[url],
  };
};

const mapDispatchProps = {
  onClickOpen: openFileDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchProps
)(HitomiListItem);
