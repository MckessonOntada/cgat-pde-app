import React from 'react';
import { useQuery } from 'react-query';

export default function useFetchQueryRetry(name, fetchData, retryOptions) {
  return useQuery([name], fetchData, {
    retry: retryOptions?.retry ?? false,
    retryDelay:
      retryOptions?.retryDelay ??
      ((attempt) => Math.min(30000 * 2 ** attempt, retryOptions?.retryDelayMaxCap ?? 30000)),
    ...retryOptions
  });
}

// retryDelay can contain
//retryOptions = {retry:3, retryDelayMaxCap(in ms): 30000}
