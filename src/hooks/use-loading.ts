'use client';
import { useLoadingContext } from '@/context/loading-context';

// Start loading state and stop once a promise is returned from whatever function uses this hook
export function useLoading() {
  const loading = useLoadingContext();

  const withLoading = async <T>(load: () => Promise<T>): Promise<T> => {
    loading.start();
    try {
      return await load();
    } finally {
      loading.stop();
    }
  };

  // For using the loading state without waiting on a promise to resolve
  const startLoading = function () {
    loading.start();
  };

  const stopLoading = function () {
    loading.stop();
  };

  return { ...loading, withLoading, startLoading, stopLoading };
}
