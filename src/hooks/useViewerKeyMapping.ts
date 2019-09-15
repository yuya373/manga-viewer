import { useEffect } from 'react';

const useViewerKeyMapping = ({
  onNextPage,
  onPrevPage,
}: {
  onNextPage: () => void;
  onPrevPage: () => void;
}): void => {
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
            break;
          default:
        }
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNextPage, onPrevPage]);
};

export default useViewerKeyMapping;
