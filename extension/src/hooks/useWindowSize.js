import { useState, useEffect } from 'react';
import { useUiStore } from './store';

// https://usehooks.com/useWindowSize/
const useWindowSize = ({
  keepStoreUpdated = false,
  responsive: {
    underCallback = () => {},
    overCallback = () => {},
    maxWidth = 0
  }
}) => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });
  const { setSidebarWidth } = useUiStore();

  useEffect(() => {
    // Scoped Timeout
    let resizeEndTimeout = null;
    // Handler to call on window resize
    const handleResize = () => {
      clearTimeout(resizeEndTimeout);
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      // Set window width/height to state
      setWindowSize(newSize);
      // Call onResizeEnd callback if width doesn't change after 150ms
      if (keepStoreUpdated) {
        resizeEndTimeout = setTimeout(() => {
          setSidebarWidth(newSize.width, keepStoreUpdated);
        }, 500);
      }
      // Call responsive callback if width dips below maxWidth
      if (newSize.width < maxWidth) {
        underCallback(newSize);
      } else {
        overCallback(newSize);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener and timeout on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeEndTimeout);
    };
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};

export default useWindowSize;
