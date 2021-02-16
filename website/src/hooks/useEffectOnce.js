import { useEffect, useRef } from 'react';

const useEffectOnce = (cb, dependencies) => {
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (dependencies.every(Boolean) && !isCalledRef.current) {
      isCalledRef.current = true;
      cb();
    }
  }, [cb, ...dependencies]);
};

export default useEffectOnce;
