"use client";

export interface GitHubCommitInfo {
  date: string;
  formattedDate: string;
  sha: string;
  author: string;
  message: string;
}

/**
 * Fetches the last commit information for a specific file from GitHub
 * @param filePath - The path to the file in the repository (e.g., 'apps/docs/docs/privacy.md')
 * @param branch - The branch to check (default: 'main')
 * @param owner - Repository owner (default: 'lstech-solutions')
 * @param repo - Repository name (default: 'human-0.com')
 * @returns Promise<GitHubCommitInfo> - The commit information
 */
export async function getLastCommitInfo(
  filePath: string,
  branch: string = 'main',
  owner: string = 'lstech-solutions',
  repo: string = 'human-0.com'
): Promise<GitHubCommitInfo> {
  try {
    // GitHub API endpoint for commits affecting a specific file
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&path=${filePath}&per_page=1`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'human-0.com',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const commits = await response.json();
    
    if (!commits || commits.length === 0) {
      throw new Error('No commits found for this file');
    }

    const latestCommit = commits[0];
    const commitDate = new Date(latestCommit.commit.committer.date);
    
    // Format date as "Month DD, YYYY"
    const formattedDate = commitDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      date: latestCommit.commit.committer.date,
      formattedDate,
      sha: latestCommit.sha,
      author: latestCommit.commit.author.name,
      message: latestCommit.commit.message,
    };
  } catch (error) {
    console.error('Error fetching GitHub commit info:', error);
    
    // Fallback to current date if API fails
    const fallbackDate = new Date();
    const formattedFallbackDate = fallbackDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      date: fallbackDate.toISOString(),
      formattedDate: formattedFallbackDate,
      sha: 'unknown',
      author: 'unknown',
      message: 'Unable to fetch commit info',
    };
  }
}

/**
 * Gets the formatted last updated date string for display
 * @param filePath - The path to the file in the repository
 * @returns Promise<string> - The formatted date string (e.g., "Last updated: November 29, 2025")
 */
export async function getLastUpdatedString(filePath: string): Promise<string> {
  const commitInfo = await getLastCommitInfo(filePath);
  return `Last updated: ${commitInfo.formattedDate}`;
}

// Predefined file paths for easy reuse
export const DOCUMENT_PATHS = {
  PRIVACY: 'apps/docs/docs/privacy.md',
  TERMS: 'apps/docs/docs/terms.md',
} as const;
