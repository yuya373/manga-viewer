import React, { Component, ReactNode } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import { OutgoingMessage, IncomingData } from '../workers/renderImage.worker';

interface Props {
  worker: any;
  image: string;
  width: number;
  height: number;
  transformOrigin: string;
}

interface State {
  scale: number;
  loading: boolean;
}

export default class Canvas extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();

  private offscreenCanvas: OffscreenCanvas | null = null;

  private mounted = false;

  public state = {
    scale: 1,
    loading: false,
  };

  public componentDidMount(): void {
    this.mounted = true;
    this.renderImage(this.props);
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

    const { scale, loading } = this.state;
    if (scale !== nextState.scale) {
      return true;
    }

    if (loading !== nextState.loading) {
      return true;
    }

    return false;
  }

  public componentDidUpdate(prevProps: Props): void {
    const { width, height, image } = this.props;

    if (image !== prevProps.image) {
      this.renderImage(this.props);
      return;
    }

    if (prevProps.width !== width || prevProps.height !== height) {
      this.renderImage(this.props);
    }
  }

  public componentWillUnmount(): void {
    this.offscreenCanvas = null;
    this.mounted = false;
    const { worker } = this.props;
    worker.onmessage = null;
  }

  private getWorker = (): any => {
    const { worker } = this.props;
    worker.onmessage = this.handleWorkerMessage;

    return worker;
  };

  private handleWorkerMessage = (ev: { data: OutgoingMessage }): void => {
    if (!this.mounted) {
      return;
    }

    if (ev.data.success) {
      const { scale } = ev.data;
      this.setState(s => ({ ...s, loading: false, scale }));
    } else {
      throw ev.data.error;
    }
  };

  private isCanvasTransferred = (): boolean => {
    if (this.offscreenCanvas == null) return false;
    return true;
  };

  private transferCanvas = (): OffscreenCanvas => {
    const canvas = this.canvas.current;
    if (canvas == null) throw new Error('no current canvas');

    this.offscreenCanvas = canvas.transferControlToOffscreen();
    return this.offscreenCanvas;
  };

  private renderImage = ({ image }: { image: string }): void => {
    this.setState(
      s => ({ ...s, loading: true }),
      () => {
        const { width, height } = this.props;
        const baseMessage = {
          image,
          width,
          height,
        };
        const worker = this.getWorker();

        if (this.isCanvasTransferred()) {
          const message: IncomingData = {
            ...baseMessage,
          };
          worker.postMessage(message);
        } else {
          const canvas = this.transferCanvas();

          const message: IncomingData = {
            ...baseMessage,
            canvas,
          };
          worker.postMessage(message, [canvas]);
        }
      }
    );
  };

  private renderProgress = (): ReactNode => {
    const { loading } = this.state;
    if (!loading) return null;

    return (
      <Grid container alignItems="center" justify="center">
        <CircularProgress />
      </Grid>
    );
  };

  public render(): ReactNode {
    const { scale, loading } = this.state;
    const { transformOrigin } = this.props;
    const style = {
      transformOrigin,
      transform: `scale(${scale})`,
      display: loading ? 'none' : 'block',
    };
    return (
      <>
        {this.renderProgress()}
        <canvas style={style} ref={this.canvas} />
      </>
    );
  }
}
