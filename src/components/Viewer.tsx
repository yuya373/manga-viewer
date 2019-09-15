import React from 'react';
import useViewerKeyMapping, { Handlers } from '../hooks/useViewerKeyMapping';
import ViewerContentContainer from '../containers/ViewerContentContainer';

export type Props = {
  width: number;
  height: number;
};

export type DispatchProps = Handlers;

const Viewer: React.FC<Props & DispatchProps> = ({
  width,
  height,
  onNextPage,
  onPrevPage,
  onPerPageChanged,
  onNextFile,
  onPrevFile,
}) => {
  useViewerKeyMapping({
    onNextPage,
    onPrevPage,
    onPerPageChanged,
    onNextFile,
    onPrevFile,
  });

  return <ViewerContentContainer width={width} height={height} />;
};

export default React.memo(Viewer);
