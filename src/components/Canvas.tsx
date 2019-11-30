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
  loading: boolean;
}

export default class Canvas extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();

  private offscreenCanvas: OffscreenCanvas | null = null;

  private worker: any | null = null;

  private mounted = false;

  public state = {
    scale: null,
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
    this.mounted = false;
    const { loading } = this.state;
    if (!loading) {
      this.terminateWorker();
    }
  }

  private getWorker = (): any => {
    if (this.worker == null) {
      this.worker = new RenderImageWorker();
      this.worker.onmessage = this.handleWorkerMessage;
    }

    return this.worker;
  };

  private terminateWorker = (): void => {
    if (this.worker == null) return;

    this.worker.terminate();
    this.worker = null;
    console.log('worker terminated');
  };

  private handleWorkerMessage = (ev: { data: OutgoingMessage }): void => {
    if (!this.mounted) {
      this.terminateWorker();
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
          this.worker.postMessage(message);
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
