// https://medium.com/datadriveninvestor/usedimension-react-hook-dcd0ecaf1160
import { useRef, useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const initialState = { width: 0, height: 0 };

const useDimension = () => {
  const [dimensions, setDimensions] = useState(initialState);
  const debouncedDimensions = useDebounce(dimensions, 500);
  const boxRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries = []) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      });
    });
    if (boxRef.current) resizeObserverRef.current.observe(boxRef.current);
    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [boxRef]);

  return [boxRef, debouncedDimensions];
};

export default useDimension;
