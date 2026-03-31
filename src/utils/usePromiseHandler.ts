import { useState, useCallback, useRef } from 'react';

/**
 * Hook for handling async operations with loading/error state.
 * Replaces @console/shared/src/hooks/usePromiseHandler
 */
export const usePromiseHandler = (): [
  <T>(promise: Promise<T>) => Promise<T>,
  boolean,
  string,
] => {
  const [inProgress, setInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mounted = useRef(true);

  const handlePromise = useCallback(<T>(promise: Promise<T>): Promise<T> => {
    setInProgress(true);
    setErrorMessage('');
    return promise
      .then((result) => {
        if (mounted.current) {
          setInProgress(false);
        }
        return result;
      })
      .catch((error) => {
        if (mounted.current) {
          setInProgress(false);
          setErrorMessage(error?.message || 'An error occurred');
        }
        throw error;
      });
  }, []);

  return [handlePromise, inProgress, errorMessage];
};
