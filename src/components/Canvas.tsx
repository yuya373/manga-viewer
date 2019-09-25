import React, { Component, ReactNode } from 'react';
import RenderImageWorker, {
  OutgoingMessage,
  IncomingData,
} from '../workers/renderImage.worker';

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

  private offscreenCanvas: OffscreenCanvas | null = null;

  private worker: any | null = null;

  public state = {
    scale: null,
  };

  public componentDidMount(): void {
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

    const { scale } = this.state;
    if (scale !== nextState.scale) {
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
    this.worker.terminate();
    this.worker = null;
  }

  private getWorker = (): any => {
    if (this.worker == null) {
      this.worker = new RenderImageWorker();
    }

    return this.worker;
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
    const { width, height } = this.props;
    const baseMessage = {
      image,
      width,
      height,
    };
    const worker = this.getWorker();

    worker.onmessage = (ev: { data: OutgoingMessage }): void => {
      if (ev.data.success) {
        this.setState({ scale: ev.data.scale });
      } else {
        throw ev.data.error;
      }
    };

    if (this.isCanvasTransferred()) {
      const message: IncomingData = {
        ...baseMessage,
      };
      this.worker.postMessage(message);
    } else {
      const canvas = this.transferCanvas();

      const message: IncomingData = {
        ...baseMessage,
        canvas,
      };
      worker.postMessage(message, [canvas]);
    }
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
