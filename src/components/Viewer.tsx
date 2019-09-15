import React from 'react';
import useViewerKeyMapping from '../hooks/useViewerKeyMapping';
import ViewerContentContainer from '../containers/ViewerContentContainer';

export type Props = {
  width: number;
  height: number;
};

export type DispatchProps = {
  onNextPage: () => void;
  onPrevPage: () => void;
};

const Viewer: React.FC<Props & DispatchProps> = ({
  width,
  height,
  onNextPage,
  onPrevPage,
}) => {
  useViewerKeyMapping({ onNextPage, onPrevPage });

  return <ViewerContentContainer width={width} height={height} />;
};

export default React.memo(Viewer);
