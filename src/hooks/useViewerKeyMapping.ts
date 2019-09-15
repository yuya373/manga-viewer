import { useEffect } from 'react';

export type Handlers = {
  onNextPage: () => void;
  onPrevPage: () => void;
  onPerPageChanged: () => void;
  onNextFile: () => void;
  onPrevFile: () => void;
};

const useViewerKeyMapping = ({
  onNextPage,
  onPrevPage,
  onPerPageChanged,
  onNextFile,
  onPrevFile,
}: Handlers): void => {
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const { altKey, ctrlKey, keyCode, metaKey, shiftKey } = event;
      // console.log(
      //   'keyup',
      //   'altKey',
      //   altKey,
      //   'ctrlKey',
      //   ctrlKey,
      //   'metaKey',
      //   metaKey,
      //   'shiftKey',
      //   shiftKey,
      //   'keyCode',
      //   keyCode
      // );
      if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
        switch (keyCode) {
          case 37:
          case 32:
            event.preventDefault();
            onNextPage();
            return;
          case 39:
            event.preventDefault();
            onPrevPage();
            return;
          case 38: // ↑
            event.preventDefault();
            onPrevFile();
            return;
          case 40: // ↓
            event.preventDefault();
            onNextFile();
            return;
          default:
            return;
        }
      }
      if (shiftKey) {
        switch (keyCode) {
          case 32:
            event.preventDefault();
            onPrevPage();
            return;
          default:
            return;
        }
      }
      if (ctrlKey) {
        switch (keyCode) {
          case 83: // S
            event.preventDefault();
            onPerPageChanged();
            break;
          default:
        }
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNextFile, onNextPage, onPerPageChanged, onPrevFile, onPrevPage]);
};

export default useViewerKeyMapping;
