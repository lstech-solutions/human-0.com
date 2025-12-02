import { useMemo } from 'react';
import versionData from '../version.json';

interface VersionInfo {
  version: string;
  build: string;
  lastModified: string;
  githubReleaseUrl: string;
  githubSourceUrl: string;
  docsVersionedUrl: string;
  webVersionedUrl: string;
}

interface GitFileInfo {
  date: string;
  hash: string;
  shortHash: string;
  author: string;
  message: string;
  historyUrl: string;
  commitUrl: string;
}

export function useVersionInfo(): VersionInfo {
  return useMemo(() => {
    const version = versionData.version;
    const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
    const docsBaseUrl = 'https://human-0.com/documentation';
    const webBaseUrl = 'https://human-0.com';

    return {
      version,
      build: versionData.build,
      lastModified: versionData.metadata.lastModified,
      githubReleaseUrl: `${githubBaseUrl}/releases/tag/v${version}`,
      githubSourceUrl: `${githubBaseUrl}/blob/main`,
      docsVersionedUrl: `${docsBaseUrl}`,
      webVersionedUrl: `${webBaseUrl}`
    };
  }, []);
}

export function createVersionedUrl(
  baseUrl: string, 
  path: string, 
  version?: string,
  params?: Record<string, string | undefined>
): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = `${baseUrl}/${cleanPath}`;
  const searchParams = new URLSearchParams();
  
  if (version) {
    searchParams.append('version', version);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    });
  }
  
  const paramString = searchParams.toString();
  return paramString ? `${url}?${paramString}` : url;
}

export function getLegalDocumentUrl(
  documentType: 'terms' | 'privacy',
  context: 'web' | 'docs' | 'github',
  version?: string,
  options?: { locale?: string; isDark?: boolean }
): string {
  const versionToUse = version || versionData.version;
  const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
  const docsBaseUrl = 'https://human-0.com/documentation';
  const webBaseUrl = 'https://human-0.com';

  switch (context) {
    case 'github':
      return `${githubBaseUrl}/blob/main/apps/docs/${documentType}.md`;
    
    case 'docs':
      return createVersionedUrl(docsBaseUrl, documentType, versionToUse, {
        locale: options?.locale,
        dark: options?.isDark?.toString()
      });
    
    case 'web':
      return createVersionedUrl(webBaseUrl, documentType, versionToUse, {
        locale: options?.locale,
        dark: options?.isDark?.toString()
      });
    
    default:
      return `${docsBaseUrl}/${documentType}`;
  }
}

export function getLegalDocumentHistoryUrl(documentType: 'terms' | 'privacy'): string {
  const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
  return `${githubBaseUrl}/commits/main/apps/docs/${documentType}.md`;
}

export function formatLastUpdated(date: string | Date, includeVersion?: boolean): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatted = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
  
  if (includeVersion) {
    return `${formatted} (v${versionData.version})`;
  }
  
  return formatted;
}

// Client-side function to get Git file info via API
export async function getLegalDocumentGitInfo(documentType: 'terms' | 'privacy'): Promise<GitFileInfo | null> {
  try {
    const response = await fetch(`/api/legal/git-info?file=${documentType}`);
    if (!response.ok) throw new Error('Failed to fetch Git info');
    
    const data = await response.json();
    return {
      date: new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hash: data.hash,
      shortHash: data.shortHash,
      author: data.author,
      message: data.message,
      historyUrl: data.historyUrl,
      commitUrl: data.commitUrl
    };
  } catch (error) {
    console.error('Error fetching Git info:', error);
    return null;
  }
}
