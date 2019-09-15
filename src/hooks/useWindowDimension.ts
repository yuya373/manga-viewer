import { useEffect } from 'react';

const useWindowDimension = ({
  onResize,
}: {
  onResize: ({ width, height }: { width: number; height: number }) => void;
}): void => {
  useEffect(() => {
    const handleResize = (): void => {
      const { innerWidth, innerHeight } = window;
      onResize({
        width: innerWidth,
        height: innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);
};

export default useWindowDimension;
