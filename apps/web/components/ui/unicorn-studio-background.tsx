import React, { useEffect, useRef } from 'react';

// TypeScript declarations for UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init: () => Promise<any>;
      destroy: () => void;
    };
  }
}

interface UnicornStudioBackgroundProps {
  projectId: string;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  pointerEvents?: 'none' | 'auto';
}

const UnicornStudioBackground: React.FC<UnicornStudioBackgroundProps> = ({
  projectId,
  className = '',
  style = {},
  zIndex = 1,
  pointerEvents = 'none'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('UnicornStudio: Component mounted, projectId:', projectId);
    
    // Validate project ID
    if (!projectId || typeof projectId !== 'string') {
      console.error('UnicornStudio: Invalid project ID', projectId);
      return;
    }
    
    // Load UnicornStudio script
    if (!window.UnicornStudio) {
      console.log('UnicornStudio: Loading script...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.36/dist/unicornStudio.umd.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('UnicornStudio: Script loaded successfully');
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          console.log('UnicornStudio: Initializing...');
          window.UnicornStudio.init().then(() => {
            console.log('UnicornStudio: Initialized successfully');
            window.UnicornStudio!.isInitialized = true;
            
            // Verify the container has the data attribute
            if (containerRef.current) {
              containerRef.current.setAttribute('data-us-project', projectId);
              console.log('UnicornStudio: Project ID set on container');
            }
          }).catch((err: any) => {
            console.error('UnicornStudio initialization error:', err);
          });
        }
      };

      script.onerror = (error) => {
        console.error('UnicornStudio: Failed to load script:', error);
      };

      document.head.appendChild(script);
    } else if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
      console.log('UnicornStudio: Already loaded, initializing...');
      window.UnicornStudio.init().then(() => {
        console.log('UnicornStudio: Initialized successfully (existing)');
        window.UnicornStudio!.isInitialized = true;
        
        // Verify the container has the data attribute
        if (containerRef.current) {
          containerRef.current.setAttribute('data-us-project', projectId);
          console.log('UnicornStudio: Project ID set on container');
        }
      }).catch((err: any) => {
        console.error('UnicornStudio initialization error:', err);
      });
    } else {
      console.log('UnicornStudio: Already initialized');
    }

    return () => {
      console.log('UnicornStudio: Component unmounting');
      if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
        console.log('UnicornStudio: Destroying...');
        window.UnicornStudio.destroy();
        window.UnicornStudio.isInitialized = false;
      }
    };
  }, [projectId]);

  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex,
    pointerEvents,
    ...style
  };

  return (
    <div 
      ref={containerRef}
      data-us-project={projectId}
      className={className}
      style={defaultStyle}
    />
  );
};

export default UnicornStudioBackground;
