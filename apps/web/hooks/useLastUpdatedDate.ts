"use client";

import { useState, useEffect } from 'react';
import { getLastUpdatedString, GitHubCommitInfo, getLastCommitInfo } from '../lib/github-utils';

export interface UseLastUpdatedDateReturn {
  lastUpdatedString: string;
  commitInfo: GitHubCommitInfo | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage the last updated date for a document
 * @param filePath - The path to the file in the repository
 * @returns UseLastUpdatedDateReturn - The hook return value
 */
export function useLastUpdatedDate(filePath: string): UseLastUpdatedDateReturn {
  const [lastUpdatedString, setLastUpdatedString] = useState<string>('Loading...');
  const [commitInfo, setCommitInfo] = useState<GitHubCommitInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastUpdatedDate() {
      try {
        setIsLoading(true);
        setError(null);
        
        const [dateString, commitData] = await Promise.all([
          getLastUpdatedString(filePath),
          getLastCommitInfo(filePath)
        ]);
        
        setLastUpdatedString(dateString);
        setCommitInfo(commitData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch last updated date';
        setError(errorMessage);
        setLastUpdatedString('Last updated: Unknown');
      } finally {
        setIsLoading(false);
      }
    }

    if (filePath) {
      fetchLastUpdatedDate();
    }
  }, [filePath]);

  return {
    lastUpdatedString,
    commitInfo,
    isLoading,
    error,
  };
}
