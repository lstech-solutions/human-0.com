export const isWeb = typeof window !== 'undefined' && 'document' in window;
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);
export const isDesktop = !isMobile && isWeb;
