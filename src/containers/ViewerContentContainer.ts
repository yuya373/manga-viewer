import { connect } from 'react-redux';
import { RootState } from '../app';
import ViewerContent, { StateProps } from '../components/ViewerContent';

const mapStateToProps = (state: RootState): StateProps => {
  const { imagesToDisplay, perPage } = state.viewer;

  return {
    imageCount: imagesToDisplay.length,
    perPage,
  };
};

export default connect(mapStateToProps)(ViewerContent);
