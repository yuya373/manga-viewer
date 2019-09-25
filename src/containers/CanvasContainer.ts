import { connect } from 'react-redux';
import { RootState } from '../reducers';
import Canvas from '../components/Canvas';

type OwnProps = {
  i: number;
  width: number;
  height: number;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const { perPage, imagesToDisplay } = state.viewer;
  const image = state.viewer.imagesToDisplay[ownProps.i];
  const drawCount = Math.min(imagesToDisplay.length, perPage);
  const width = ownProps.width / drawCount;

  let transformOrigin = 'center';
  if (drawCount === 2) {
    transformOrigin = ownProps.i === 0 ? 'center right' : 'center left';
  }

  return {
    image,
    width,
    transformOrigin,
  };
};

export default connect(mapStateToProps)(Canvas);
