import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  const handleKeyDown = useCallback(
    (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      for (const s of shortcuts) {
        if (s.meta && !isMeta) continue;
        if (s.key.toLowerCase() === e.key.toLowerCase() && (!s.meta || isMeta)) {
          e.preventDefault();
          s.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
