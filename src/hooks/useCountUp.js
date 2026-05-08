import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target == null || isNaN(target)) return;
    const from = prevTarget.current;
    const to = target;
    prevTarget.current = target;
    startRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return Math.round(value);
}

export default useCountUp;
