import React, { Component, ReactNode } from 'react';

interface Props {
  image: string;
  width: number;
  height: number;
  transformOrigin: string;
}

interface State {
  scale: null | number;
}

export default class Canvas extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();

  private image: HTMLImageElement | null = null;

  public state = {
    scale: null,
  };

  public componentDidMount(): void {
    this.loadImageToCanvas(this.props);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const { width, height, image } = this.props;

    if (
      width !== nextProps.width ||
      height !== nextProps.height ||
      image !== nextProps.image
    ) {
      return true;
    }

    const { scale } = this.state;
    if (scale !== nextState.scale) {
      return true;
    }

    return false;
  }

  public componentDidUpdate(prevProps: Props): void {
    const { width, height, image } = this.props;

    if (image !== prevProps.image) {
      this.image = null;
      this.loadImageToCanvas(this.props);
      return;
    }

    if (prevProps.width !== width || prevProps.height !== height) {
      this.renderImage();
    }
  }

  private loadImageToCanvas = ({ image }: { image: string }): void => {
    this.image = new Image();
    this.image.onload = () => {
      console.log('Load Success. URL: ', image);
      this.renderImage();
    };
    this.image.onerror = ev => {
      console.error('Load failed. URL: ', image);
    };
    this.image.src = image;
  };

  private renderImage = (): void => {
    const { image } = this;
    if (!image) return;

    if (!this.canvas) return;

    const canvas = this.canvas.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
    });

    canvas.height = image.height;
    canvas.width = image.width;
    if (ctx) {
      ctx.drawImage(
        image, // source
        0,
        0 // source point (x, y)
      );
    }

    const { width, height } = this.props;
    const scaleX = width / image.width;
    const scaleY = height / image.height;
    const scaleToFit = Math.min(scaleX, scaleY);
    this.setState({ scale: scaleToFit });
  };

  public render(): ReactNode {
    const { scale } = this.state;
    const { transformOrigin } = this.props;
    const style =
      scale === null
        ? {}
        : {
            transformOrigin,
            transform: `scale(${scale})`,
          };
    return <canvas style={style} ref={this.canvas} />;
  }
}
