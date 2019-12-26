import React from 'react';
import { Grid } from '@material-ui/core';
import CanvasContainer from '../containers/CanvasContainer';
import RenderImageWorker from '../workers/renderImage.worker';

const workers = [new RenderImageWorker(), new RenderImageWorker()];

export type StateProps = {
  imageCount: number;
  perPage: 1 | 2;
};

type Props = {
  width: number;
  height: number;
};

const ViewerContent: React.FC<Props & StateProps> = ({
  imageCount,
  width,
  height,
  perPage,
}) => {
  const drawCount = Math.min(imageCount, perPage);
  const canvases = [];
  for (let i = 0; i < imageCount; i += 1) {
    let justify: 'center' | 'flex-end' | 'flex-start' = 'center';
    let xs: 6 | 12 = 12;

    if (drawCount === 2) {
      justify = i === 0 ? 'flex-end' : 'flex-start';
      xs = 6;
    }

    canvases.push(
      <Grid item xs={xs} key={i}>
        <Grid
          container
          wrap="nowrap"
          direction="row"
          alignItems="center"
          justify={justify}
        >
          <CanvasContainer
            i={i}
            worker={workers[i]}
            width={width}
            height={height}
          />
        </Grid>
      </Grid>
    );
  }

  return <>{canvases}</>;
};

export default React.memo(ViewerContent);
