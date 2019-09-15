import { useEffect } from 'react';

const useWindowDimension = (
  onResize: (params: { width: number; height: number }) => void
): void => {
  useEffect(() => {
    const handleResize = (): void => {
      const { innerWidth, innerHeight } = window;
      onResize({
        width: innerWidth,
        height: innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);
};

export default useWindowDimension;
