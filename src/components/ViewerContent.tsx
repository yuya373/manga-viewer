import React from 'react';
import { Grid } from '@material-ui/core';
import Canvas from './Canvas';

export type StateProps = {
  images: Array<string>;
  perPage: 1 | 2;
};

type Props = {
  width: number;
  height: number;
};

const ViewerContent: React.FC<Props & StateProps> = ({
  images,
  width,
  height,
  perPage,
}) => {
  const drawCount = Math.min(images.length, perPage);

  const canvases = images.map((e, i) => {
    let justify: 'center' | 'flex-end' | 'flex-start' = 'center';
    let transformOrigin = 'center';
    let xs: 6 | 12 = 12;

    if (drawCount === 2) {
      justify = i === 0 ? 'flex-end' : 'flex-start';
      transformOrigin = i === 0 ? 'center right' : 'center left';
      xs = 6;
    }

    return (
      <Grid item xs={xs} key={e}>
        <Grid
          container
          wrap="nowrap"
          direction="row"
          alignItems="center"
          justify={justify}
        >
          <Canvas
            image={e}
            width={width / drawCount}
            height={height}
            transformOrigin={transformOrigin}
          />
        </Grid>
      </Grid>
    );
  });

  return <>{canvases}</>;
};

export default React.memo(ViewerContent);
