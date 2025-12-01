# Implementation Plan

- [ ] 1. Set up project dependencies and configuration
  - Install required packages: @livepeer/react, expo-av, hls.js
  - Add environment variables to .env and .env.example files
  - Configure TypeScript types for new dependencies
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 2. Create core type definitions and interfaces
  - Define StreamConfig, PlayerState, StreamMetrics, and StreamError types
  - Create interfaces for LivepeerService, AudioPlayerManager, and hooks
  - Set up type exports in stream.types.ts
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Implement Livepeer service layer
  - Create LivepeerService class with API integration
  - Implement getStreamInfo, getPlaybackUrl, and checkStreamHealth methods
  - Add event subscription methods (onStreamStart, onStreamEnd, onHealthChange)
  - Implement error handling with proper error types
  - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3.1 Write property test for Livepeer service
  - **Property 5: Playback URL validation**
  - **Property 7: Health metrics processing**
  - **Property 9: Playback endpoint format handling**
  - **Property 10: Network error graceful handling**
  - **Validates: Requirements 2.3, 3.2, 3.4, 3.5**

- [ ] 4. Implement audio player manager
  - Create AudioPlayerManager class for cross-platform audio playback
  - Implement load, play, pause, stop methods
  - Add volume control methods (setVolume, mute, unmute)
  - Implement playback status tracking and event handlers
  - Handle platform-specific audio configuration (iOS/Android/Web)
  - _Requirements: 1.3, 1.4, 1.5, 7.3, 7.5_

- [ ] 4.1 Write property test for audio player manager
  - **Property 2: Play button initiates playback**
  - **Property 3: Pause button halts playback**
  - **Property 4: Volume control updates audio level**
  - **Validates: Requirements 1.3, 1.4, 1.5**

- [ ] 5. Create stream state store with Zustand
  - Set up StreamStateStore with initial state
  - Implement state update actions (setStreamInfo, setPlaybackState, setStreamHealth, setError)
  - Add reset action for cleanup
  - Ensure state persistence where appropriate
  - _Requirements: 1.2, 5.1, 5.2, 5.3, 5.4_

- [ ] 6. Implement useLivepeerStream hook
  - Create custom hook integrating LivepeerService and AudioPlayerManager
  - Implement playback control functions (play, pause, setVolume, toggleMute)
  - Add stream status tracking (isPlaying, isLoading, isLive, error)
  - Implement automatic stream connection when session is active
  - Handle cleanup on unmount
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.3, 2.4_

- [ ] 6.1 Write property test for stream hook
  - **Property 1: Stream connection triggers buffering**
  - **Property 6: Stream termination handling**
  - **Property 8: State change event handling**
  - **Validates: Requirements 1.2, 2.4, 3.3**

- [ ] 7. Create StreamStatusIndicator component
  - Build component to display LIVE indicator, buffering state, and connection quality
  - Implement conditional rendering based on stream health
  - Add visual indicators for different states (live, buffering, error, offline)
  - Apply theme-aware styling
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7.1 Write property test for status indicator
  - **Property 14: Live indicator display**
  - **Property 15: Buffering state display**
  - **Property 16: Connection quality warnings**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 8. Create LiveRadioControls component
  - Build playback controls (play/pause button, volume slider, mute button)
  - Implement responsive layout for mobile and desktop
  - Add touch-friendly sizing for mobile
  - Connect controls to useLivepeerStream hook
  - Apply theme-aware styling
  - _Requirements: 1.3, 1.4, 1.5, 4.3, 4.4_

- [ ] 8.1 Write property test for radio controls
  - **Property 13: Playback indicator visibility**
  - **Validates: Requirements 4.5**

- [ ] 9. Implement LiveRadioPlayer main component
  - Create main player component integrating controls and status indicator
  - Implement layout with proper spacing and alignment
  - Add loading and error states with fallback UI
  - Ensure responsive design for different screen sizes
  - Apply theme integration matching footer design
  - _Requirements: 1.1, 1.6, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9.1 Write property test for main player component
  - **Property 11: Theme consistency**
  - **Property 12: Theme switching reactivity**
  - **Validates: Requirements 4.1, 4.2**

- [ ] 10. Implement error handling and recovery logic
  - Add retry logic with exponential backoff
  - Implement error categorization (network, stream, playback, API)
  - Create user-friendly error messages with i18n support
  - Add manual retry option after max attempts
  - Handle consecutive error threshold
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10.1 Write property test for error handling
  - **Property 17: Disconnect recovery**
  - **Property 19: Playback URL failure retry**
  - **Property 20: Network loss handling**
  - **Property 21: Unexpected stream end handling**
  - **Property 22: Playback failure logging and feedback**
  - **Property 23: Consecutive error handling**
  - **Validates: Requirements 5.4, 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 11. Integrate LiveRadioPlayer into AppFooter
  - Update AppFooter component to include LiveRadioPlayer
  - Ensure proper layout integration with existing footer content
  - Test responsive behavior on mobile and desktop
  - Verify theme consistency with footer design
  - _Requirements: 1.1, 4.1_

- [ ] 12. Implement navigation and background playback persistence
  - Configure audio session for background playback on mobile
  - Implement playback continuation during screen navigation
  - Add state synchronization when returning to screens
  - Handle app backgrounding and foregrounding events
  - Implement graceful cleanup on app close
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12.1 Write property test for playback persistence
  - **Property 24: Navigation playback persistence**
  - **Property 25: Playback state synchronization**
  - **Property 26: Background playback continuation**
  - **Property 27: Foreground state sync**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 13. Implement keyboard shortcuts for web platform
  - Add keyboard event listeners for spacebar (play/pause)
  - Implement up/down arrow keys for volume control
  - Add 'M' key for mute toggle
  - Prevent default browser behavior for these keys
  - Ensure shortcuts only work when player is focused or visible
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 14. Implement accessibility features
  - Add ARIA labels to all interactive controls
  - Implement ARIA live regions for status announcements
  - Add screen reader announcements for playback state changes
  - Ensure proper focus management and tab order
  - Provide text alternatives for visual indicators
  - Test with screen readers (VoiceOver, TalkBack, NVDA)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 14.1 Write property test for accessibility
  - **Property 29: Screen reader playback state announcements**
  - **Property 30: Control accessibility labels**
  - **Property 31: Keyboard navigation support**
  - **Property 32: Status change announcements**
  - **Property 33: Visual indicator text alternatives**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 15. Add internationalization support
  - Add translation keys for player UI text
  - Translate error messages
  - Translate status indicators
  - Translate accessibility labels
  - Test with multiple languages
  - _Requirements: 6.4_

- [ ] 16. Implement stream health monitoring
  - Create useStreamHealth hook for periodic health checks
  - Display optional detailed metrics (bitrate, latency) when enabled
  - Update connection quality indicator based on health metrics
  - Implement health-based warnings
  - _Requirements: 5.3, 5.5_

- [ ] 16.1 Write property test for health monitoring
  - **Property 18: Optional metrics display**
  - **Validates: Requirements 5.5**

- [ ] 17. Add environment configuration utilities
  - Create stream-config.ts utility to load environment variables
  - Implement validation for required configuration
  - Add fallback values for optional configuration
  - Log warnings for missing configuration
  - Support environment-specific configurations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 17.1 Write property test for configuration
  - **Property 28: Environment-specific configuration**
  - **Validates: Requirements 8.5**

- [ ] 18. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Platform-specific optimizations
  - Implement HLS.js integration for web platform
  - Configure iOS audio session for background playback
  - Configure Android audio focus for background playback
  - Add Media Session API support for web
  - Implement Control Center integration for iOS
  - Add notification controls for Android
  - _Requirements: 7.3, 7.4_

- [ ] 20. Performance optimizations
  - Implement lazy loading for Livepeer SDK
  - Add memoization to expensive component computations
  - Debounce volume slider updates
  - Optimize re-renders with React.memo and useMemo
  - Implement connection pooling for API calls
  - Add caching for stream info
  - _Requirements: 1.2, 1.5_

- [ ] 20.1 Write unit tests for performance optimizations
  - Test lazy loading behavior
  - Verify memoization prevents unnecessary re-renders
  - Test debouncing of volume updates
  - Verify caching reduces API calls

- [ ] 21. Add logging and error tracking
  - Implement structured logging for stream lifecycle events
  - Log all errors with context
  - Add performance metric logging
  - Ensure logs respect user privacy
  - Integrate with existing logging infrastructure
  - _Requirements: 6.4_

- [ ] 22. Create documentation
  - Document component props and usage
  - Add JSDoc comments to all public APIs
  - Create README for stream integration
  - Document environment variable configuration
  - Add troubleshooting guide
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 23. Final testing and polish
  - Run full test suite (unit, property, integration)
  - Perform manual testing on web, iOS, and Android
  - Test with real Livepeer stream using provided credentials
  - Verify OBS integration with RTMP and SRT
  - Test all error scenarios
  - Verify accessibility with screen readers
  - Test theme switching
  - Test background playback
  - Verify keyboard shortcuts on web
  - Check responsive design on various screen sizes
  - _Requirements: All_

- [ ] 24. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
