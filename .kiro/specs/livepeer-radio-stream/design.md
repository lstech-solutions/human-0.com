# Design Document

## Overview

This design document outlines the technical architecture for integrating Livepeer live streaming into the HUMΛN-Ø application. The solution will add a persistent audio player component to the application footer, enabling 24/7 radio broadcast functionality using Livepeer's decentralized streaming infrastructure.

The implementation will leverage the Livepeer React SDK for stream management, React Native's audio capabilities for playback, and integrate seamlessly with the existing footer component design. The architecture prioritizes reliability, performance, and user experience across web and mobile platforms.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HUMΛN-Ø Application                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   App Footer Component                  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Live Radio Player Component              │  │ │
│  │  │  ┌────────────┐  ┌──────────────────────────┐   │  │ │
│  │  │  │  Controls  │  │   Stream Status Display  │   │  │ │
│  │  │  └────────────┘  └──────────────────────────┘   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Livepeer Service Layer                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │ Stream State │  │ Playback Mgr │  │ Health Mon. │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      Livepeer Network        │
              │  ┌────────────────────────┐  │
              │  │   Stream Ingestion     │  │
              │  │  (RTMP/SRT Endpoint)   │  │
              │  └────────────────────────┘  │
              │             │                 │
              │             ▼                 │
              │  ┌────────────────────────┐  │
              │  │  Transcoding & CDN     │  │
              │  └────────────────────────┘  │
              │             │                 │
              │             ▼                 │
              │  ┌────────────────────────┐  │
              │  │   HLS Playback URL     │  │
              │  └────────────────────────┘  │
              └──────────────────────────────┘
                             ▲
                             │
                   ┌─────────┴─────────┐
                   │                   │
              ┌────▼────┐         ┌────▼────┐
              │   OBS   │         │  Other  │
              │ Studio  │         │ Sources │
              └─────────┘         └─────────┘
```

### Technology Stack

- **Frontend Framework**: React Native (Expo)
- **Streaming SDK**: @livepeer/react (for web) / Custom integration (for native)
- **Audio Playback**: expo-av for cross-platform audio
- **State Management**: Zustand (existing in project)
- **HTTP Client**: Native fetch API
- **Environment Config**: expo-constants for environment variables

### Platform Considerations

**Web Platform:**
- Use HTML5 Audio element with HLS.js for stream playback
- Leverage @livepeer/react hooks for stream management
- Support Media Session API for system-level controls

**Mobile Platform (iOS/Android):**
- Use expo-av for native audio playback
- Implement background audio support with proper audio session configuration
- Handle platform-specific audio interruptions (calls, notifications)

## Components and Interfaces

### 1. LiveRadioPlayer Component

The main component that renders the audio player UI in the footer.

**Props Interface:**
```typescript
interface LiveRadioPlayerProps {
  streamKey: string;
  playbackId?: string;
  autoPlay?: boolean;
  showDetailedMetrics?: boolean;
  className?: string;
}
```

**Responsibilities:**
- Render player controls (play, pause, volume, mute)
- Display stream status and health indicators
- Handle user interactions
- Manage responsive layout for mobile/desktop
- Apply theme-aware styling

### 2. useLivepeerStream Hook

Custom hook for managing Livepeer stream state and playback.

**Interface:**
```typescript
interface UseLivepeerStreamReturn {
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  isLive: boolean;
  error: Error | null;
  
  // Stream info
  playbackUrl: string | null;
  streamHealth: StreamHealth | null;
  
  // Controls
  play: () => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // State
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
}

interface StreamHealth {
  bitrate: number;
  latency: number;
  isHealthy: boolean;
  lastUpdated: Date;
}
```

### 3. LivepeerService Class

Service layer for interacting with Livepeer API and managing stream lifecycle.

**Interface:**
```typescript
class LivepeerService {
  constructor(apiKey: string);
  
  // Stream management
  getStreamInfo(streamKey: string): Promise<StreamInfo>;
  getPlaybackUrl(playbackId: string): Promise<string>;
  checkStreamHealth(streamKey: string): Promise<StreamHealth>;
  
  // Event subscriptions
  onStreamStart(callback: (stream: StreamInfo) => void): () => void;
  onStreamEnd(callback: () => void): () => void;
  onHealthChange(callback: (health: StreamHealth) => void): () => void;
}

interface StreamInfo {
  id: string;
  playbackId: string;
  isActive: boolean;
  createdAt: Date;
  streamKey: string;
}
```

### 4. AudioPlayerManager Class

Platform-agnostic audio playback manager.

**Interface:**
```typescript
class AudioPlayerManager {
  // Playback control
  load(url: string): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  
  // Volume control
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unmute(): void;
  
  // State queries
  isPlaying(): boolean;
  isLoading(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  
  // Event handlers
  onPlaybackStatusUpdate(callback: (status: PlaybackStatus) => void): () => void;
  onError(callback: (error: Error) => void): () => void;
}

interface PlaybackStatus {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
}
```

### 5. StreamStateStore (Zustand)

Global state management for stream status.

**Interface:**
```typescript
interface StreamState {
  // Stream info
  streamKey: string | null;
  playbackId: string | null;
  isLive: boolean;
  
  // Playback state
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  
  // Health
  streamHealth: StreamHealth | null;
  lastError: Error | null;
  
  // Actions
  setStreamInfo: (info: Partial<StreamState>) => void;
  setPlaybackState: (state: Partial<PlaybackState>) => void;
  setStreamHealth: (health: StreamHealth) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}
```

## Data Models

### Stream Configuration

```typescript
interface StreamConfig {
  streamKey: string;
  rtmpIngestUrl: string;
  srtIngestUrl: string;
  livepeerApiKey: string;
  playbackId?: string;
  autoPlay: boolean;
  retryAttempts: number;
  retryDelay: number;
}
```

### Player State

```typescript
interface PlayerState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'ended';
  volume: number; // 0-1
  isMuted: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  buffering: boolean;
}
```

### Stream Metrics

```typescript
interface StreamMetrics {
  bitrate: number; // kbps
  latency: number; // milliseconds
  droppedFrames: number;
  bufferHealth: number; // 0-100
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  timestamp: Date;
}
```

### Error Types

```typescript
type StreamError =
  | { type: 'NETWORK_ERROR'; message: string; retryable: boolean }
  | { type: 'STREAM_NOT_FOUND'; message: string; retryable: false }
  | { type: 'PLAYBACK_ERROR'; message: string; retryable: boolean }
  | { type: 'API_ERROR'; message: string; statusCode: number; retryable: boolean }
  | { type: 'TIMEOUT_ERROR'; message: string; retryable: boolean };
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Stream connection triggers buffering

*For any* active stream session with a valid playback URL, when the Audio Player Component connects to the stream, the component should enter a buffering state before playback begins.

**Validates: Requirements 1.2**

### Property 2: Play button initiates playback

*For any* stream state where a valid playback URL exists, when the user clicks the play button, the Audio Player Component should transition to playing state and begin audio output.

**Validates: Requirements 1.3**

### Property 3: Pause button halts playback

*For any* playing stream, when the user clicks the pause button, the Audio Player Component should transition to paused state and stop audio output.

**Validates: Requirements 1.4**

### Property 4: Volume control updates audio level

*For any* volume value between 0 and 1, when the user adjusts the volume control to that value, the audio output level should match the specified volume.

**Validates: Requirements 1.5**

### Property 5: Playback URL validation

*For any* stream session that begins, when the Livepeer SDK provides a playback URL, the URL should be a valid HLS or WebRTC endpoint that the player can load.

**Validates: Requirements 2.3**

### Property 6: Stream termination handling

*For any* active stream session, when the broadcaster stops streaming and the session terminates, the Audio Player Component should detect the termination and update its state accordingly.

**Validates: Requirements 2.4**

### Property 7: Health metrics processing

*For any* stream health query response from the Livepeer SDK, when the application receives health metrics, the metrics should be parsed and stored correctly with valid bitrate and latency values.

**Validates: Requirements 3.2**

### Property 8: State change event handling

*For any* stream session state change, when the Livepeer SDK emits a state change event, the application's subscribed event handlers should be invoked with the correct state information.

**Validates: Requirements 3.3**

### Property 9: Playback endpoint format handling

*For any* playback URL request, when the Livepeer SDK returns a playback endpoint, the application should correctly identify and handle both HLS and WebRTC formats.

**Validates: Requirements 3.4**

### Property 10: Network error graceful handling

*For any* network error that occurs during stream operations, when the Livepeer SDK provides error information, the application should handle the error gracefully without crashing and provide user feedback.

**Validates: Requirements 3.5**

### Property 11: Theme consistency

*For any* theme mode (light or dark), when the Audio Player Component renders, it should apply styling that matches the current theme's color scheme and design tokens.

**Validates: Requirements 4.1**

### Property 12: Theme switching reactivity

*For any* theme change event, when the application theme switches between light and dark modes, the Audio Player Component should update its appearance to match the new theme.

**Validates: Requirements 4.2**

### Property 13: Playback indicator visibility

*For any* audio playback state, when audio is actively playing, the Audio Player Component should display a visual indicator that is visible and distinguishable from the paused state.

**Validates: Requirements 4.5**

### Property 14: Live indicator display

*For any* stream session, when the session is active and broadcasting, the Audio Player Component should display a "LIVE" indicator to users.

**Validates: Requirements 5.1**

### Property 15: Buffering state display

*For any* stream buffering event, when the audio player is buffering content, the component should display a loading state indicator.

**Validates: Requirements 5.2**

### Property 16: Connection quality warnings

*For any* stream health metrics indicating poor connection quality, when the connection quality falls below acceptable thresholds, the Audio Player Component should display a warning to the user.

**Validates: Requirements 5.3**

### Property 17: Disconnect recovery

*For any* stream disconnection event, when the stream connection is lost, the Audio Player Component should display an error message and automatically attempt to reconnect.

**Validates: Requirements 5.4**

### Property 18: Optional metrics display

*For any* stream with available health metrics, when bitrate and latency information is present, the Audio Player Component should display these metrics when the detailed metrics option is enabled.

**Validates: Requirements 5.5**

### Property 19: Playback URL failure retry

*For any* playback URL that fails to load, when the load failure occurs, the Audio Player Component should display an error message and attempt to retry the connection up to the configured retry limit.

**Validates: Requirements 6.1**

### Property 20: Network loss handling

*For any* network connectivity loss event, when network connectivity is lost during playback, the Audio Player Component should pause playback and display a reconnection message.

**Validates: Requirements 6.2**

### Property 21: Unexpected stream end handling

*For any* stream session that ends unexpectedly, when the unexpected termination occurs, the Audio Player Component should transition to the fallback state.

**Validates: Requirements 6.3**

### Property 22: Playback failure logging and feedback

*For any* audio playback failure, when the failure occurs, the system should log the error details and the Audio Player Component should provide user-friendly feedback.

**Validates: Requirements 6.4**

### Property 23: Consecutive error handling

*For any* sequence of consecutive errors, when the number of consecutive errors exceeds the configured threshold, the Audio Player Component should stop automatic retry attempts and display a manual retry option.

**Validates: Requirements 6.5**

### Property 24: Navigation playback persistence

*For any* screen navigation event, when the user navigates to a different screen while audio is playing, the audio playback should continue without interruption.

**Validates: Requirements 7.1**

### Property 25: Playback state synchronization

*For any* screen that displays the Audio Player Component, when the user navigates to that screen, the component should reflect the current actual playback state.

**Validates: Requirements 7.2**

### Property 26: Background playback continuation

*For any* mobile application backgrounding event, when the application is moved to the background while audio is playing, the audio playback should continue in the background.

**Validates: Requirements 7.3**

### Property 27: Foreground state sync

*For any* mobile application foregrounding event, when the application returns to the foreground, the Audio Player Component should sync its UI state with the current playback state.

**Validates: Requirements 7.4**

### Property 28: Environment-specific configuration

*For any* deployment environment, when the application starts in that environment, the system should load and use the stream configuration appropriate for that specific environment.

**Validates: Requirements 8.5**

### Property 29: Screen reader playback state announcements

*For any* playback state change, when the state changes, the Audio Player Component should update ARIA attributes so screen readers announce the current playback state.

**Validates: Requirements 10.1**

### Property 30: Control accessibility labels

*For any* interactive control in the Audio Player Component, when the control is rendered, it should have a descriptive aria-label attribute for screen readers.

**Validates: Requirements 10.2**

### Property 31: Keyboard navigation support

*For any* interactive element in the Audio Player Component, when using keyboard navigation, the element should be focusable and have proper tab order.

**Validates: Requirements 10.3**

### Property 32: Status change announcements

*For any* stream status change, when the status changes, the Audio Player Component should update ARIA live regions to announce the change to assistive technologies.

**Validates: Requirements 10.4**

### Property 33: Visual indicator text alternatives

*For any* visual indicator displayed by the Audio Player Component, when the indicator is rendered, it should have a corresponding text alternative accessible to screen readers.

**Validates: Requirements 10.5**

## Error Handling

### Error Categories

**1. Network Errors**
- Connection timeout
- DNS resolution failure
- SSL/TLS errors
- Network unreachable

**Strategy:**
- Implement exponential backoff for retries
- Maximum 5 retry attempts with delays: 1s, 2s, 4s, 8s, 16s
- Display user-friendly error messages
- Provide manual retry option after max attempts

**2. Stream Errors**
- Stream not found
- Stream ended
- Invalid stream key
- Playback URL expired

**Strategy:**
- Distinguish between retryable and non-retryable errors
- For non-retryable errors (invalid key), show error and disable retry
- For retryable errors (expired URL), attempt to fetch new URL
- Log all errors for debugging

**3. Playback Errors**
- Audio codec not supported
- Corrupted stream data
- Buffer underrun
- Audio device unavailable

**Strategy:**
- Attempt to recover by reloading the stream
- If recovery fails, fall back to error state
- Provide clear error messages about codec/device issues
- Log technical details for support

**4. API Errors**
- Authentication failure
- Rate limiting
- Invalid API response
- API service unavailable

**Strategy:**
- Handle 401/403 errors by checking API key configuration
- Implement rate limit backoff (respect Retry-After header)
- Validate API responses before processing
- Provide fallback behavior when API is unavailable

### Error Recovery Flow

```
Error Occurs
    │
    ├─→ Is Retryable?
    │   ├─→ Yes: Increment retry count
    │   │   ├─→ Count < Max?
    │   │   │   ├─→ Yes: Wait (exponential backoff) → Retry
    │   │   │   └─→ No: Show manual retry option
    │   │   └─→ Display error message
    │   └─→ No: Show error message, disable retry
    │
    └─→ Log error details
```

### Error Messages

User-facing error messages should be:
- Clear and non-technical
- Actionable when possible
- Consistent in tone with app design
- Localized using i18n system

Examples:
- "Unable to connect to the radio stream. Please check your internet connection."
- "The broadcast is currently offline. We'll automatically reconnect when it's back."
- "Something went wrong with playback. Tap to try again."

## Testing Strategy

### Unit Testing

**Components to Test:**
- LiveRadioPlayer component rendering
- useLivepeerStream hook state management
- LivepeerService API interactions
- AudioPlayerManager playback control
- StreamStateStore state updates

**Testing Approach:**
- Use React Native Testing Library for component tests
- Mock external dependencies (Livepeer SDK, expo-av)
- Test user interactions (play, pause, volume)
- Verify state transitions
- Test error handling paths

**Example Test Cases:**
- Player renders with correct initial state
- Play button triggers playback
- Volume slider updates volume state
- Error states display correct messages
- Theme changes update component styling

### Property-Based Testing

**Property Testing Library:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Use custom generators for domain-specific types
- Seed tests for reproducibility

**Property Test Implementation:**
- Each correctness property will be implemented as a separate property-based test
- Tests will be tagged with comments referencing the design document property
- Tag format: `// Feature: livepeer-radio-stream, Property N: [property description]`

**Custom Generators Needed:**
- Stream configuration generator (valid/invalid keys, URLs)
- Volume value generator (0-1 range, edge cases)
- Stream health metrics generator
- Error scenario generator
- Playback state generator

**Key Properties to Test:**
- Volume control updates (Property 4)
- Playback URL validation (Property 5)
- Health metrics processing (Property 7)
- Theme consistency (Property 11)
- Error handling (Properties 19-23)
- State synchronization (Properties 25, 27)

### Integration Testing

**Scenarios:**
- End-to-end stream playback flow
- Theme switching during playback
- Navigation while playing
- Background/foreground transitions
- Network interruption recovery
- Multiple error scenarios

**Testing Environment:**
- Use Livepeer testnet for integration tests
- Mock stream endpoints for controlled testing
- Test on both web and mobile platforms
- Test with different network conditions

### Manual Testing Checklist

**Functional Testing:**
- [ ] Stream plays successfully on web
- [ ] Stream plays successfully on iOS
- [ ] Stream plays successfully on Android
- [ ] Play/pause controls work correctly
- [ ] Volume control adjusts audio level
- [ ] Mute toggle works correctly
- [ ] Stream status indicators display correctly
- [ ] Error messages appear for failures
- [ ] Retry logic works as expected
- [ ] Background playback works on mobile

**UI/UX Testing:**
- [ ] Player matches footer design
- [ ] Responsive layout works on mobile
- [ ] Responsive layout works on desktop
- [ ] Theme switching updates player appearance
- [ ] Loading states are clear
- [ ] Error states are user-friendly
- [ ] Animations are smooth
- [ ] Touch targets are appropriate size

**Accessibility Testing:**
- [ ] Screen reader announces playback state
- [ ] All controls have descriptive labels
- [ ] Keyboard navigation works on web
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Status changes are announced

**Performance Testing:**
- [ ] Audio starts playing within 3 seconds
- [ ] No memory leaks during extended playback
- [ ] CPU usage is reasonable
- [ ] Battery impact is acceptable on mobile
- [ ] Network usage is efficient

## Implementation Notes

### Dependencies to Add

```json
{
  "dependencies": {
    "@livepeer/react": "^3.0.0",
    "expo-av": "~14.0.0",
    "hls.js": "^1.4.0"
  }
}
```

### Environment Variables

Add to `.env` and `.env.example`:

```bash
# Livepeer Configuration
EXPO_PUBLIC_LIVEPEER_API_KEY=your_api_key_here
EXPO_PUBLIC_STREAM_KEY=24d1-bl4o-ec7w-hhhk
EXPO_PUBLIC_RTMP_INGEST_URL=rtmp://rtmp.livepeer.com/live
EXPO_PUBLIC_SRT_INGEST_URL=srt://rtmp.livepeer.com:2935
EXPO_PUBLIC_PLAYBACK_ID=your_playback_id_here
EXPO_PUBLIC_AUTO_PLAY_RADIO=false
```

### File Structure

```
apps/web/
├── components/
│   ├── LiveRadioPlayer.tsx          # Main player component
│   ├── LiveRadioControls.tsx        # Playback controls
│   ├── StreamStatusIndicator.tsx    # Status display
│   └── AppFooter.tsx                # Updated footer (existing)
├── hooks/
│   ├── useLivepeerStream.ts         # Stream management hook
│   ├── useAudioPlayer.ts            # Audio playback hook
│   └── useStreamHealth.ts           # Health monitoring hook
├── services/
│   ├── livepeer.service.ts          # Livepeer API service
│   └── audio-player.manager.ts      # Audio playback manager
├── stores/
│   └── stream.store.ts              # Stream state (Zustand)
├── types/
│   └── stream.types.ts              # TypeScript interfaces
└── utils/
    ├── stream-config.ts             # Configuration loader
    └── stream-errors.ts             # Error utilities
```

### Platform-Specific Considerations

**Web:**
- Use HLS.js for HLS stream playback
- Implement Media Session API for system controls
- Handle browser autoplay policies
- Support keyboard shortcuts

**iOS:**
- Configure audio session for background playback
- Handle audio interruptions (calls, Siri)
- Support Control Center integration
- Handle AirPlay

**Android:**
- Configure audio focus for background playback
- Handle audio interruptions (calls, notifications)
- Support notification controls
- Handle Bluetooth audio

### Performance Optimizations

1. **Lazy Loading**: Load Livepeer SDK only when needed
2. **Memoization**: Memoize expensive computations in components
3. **Debouncing**: Debounce volume slider updates
4. **Connection Pooling**: Reuse HTTP connections for API calls
5. **Caching**: Cache stream info to reduce API calls
6. **Efficient Re-renders**: Use React.memo and useMemo appropriately

### Security Considerations

1. **API Key Protection**: Never expose API keys in client code
2. **Environment Variables**: Use EXPO_PUBLIC_ prefix for client-accessible vars
3. **HTTPS Only**: Enforce HTTPS for all API communications
4. **Input Validation**: Validate all user inputs and API responses
5. **Error Messages**: Don't expose sensitive information in error messages
6. **Rate Limiting**: Implement client-side rate limiting for API calls

### Monitoring and Analytics

**Metrics to Track:**
- Stream connection success rate
- Average time to first audio
- Playback error rate
- Buffer underrun frequency
- User engagement (play duration)
- Platform distribution (web/iOS/Android)

**Logging:**
- Log all errors with context
- Log stream lifecycle events
- Log performance metrics
- Use structured logging format
- Respect user privacy in logs

### Future Enhancements

1. **Multiple Streams**: Support switching between multiple radio channels
2. **Offline Mode**: Cache recent broadcasts for offline playback
3. **Visualizer**: Add audio visualizer animation
4. **Chat Integration**: Add live chat alongside stream
5. **Schedule**: Display broadcast schedule
6. **Notifications**: Notify users when favorite shows start
7. **Recording**: Allow users to record broadcasts
8. **Sharing**: Share currently playing content
