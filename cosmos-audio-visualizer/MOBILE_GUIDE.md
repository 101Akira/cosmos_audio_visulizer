# Mobile User Guide - Cosmos Audio Visualizer

## Mobile Improvements

The Cosmos Audio Visualizer is now fully optimized for mobile devices with a completely redesigned mobile experience.

## Key Mobile Features

### 1. **Floating Menu Button**
- **Purple circular button** appears in the top-left corner on mobile devices
- Tap to open/close the control panel
- Always accessible without blocking the visualization

### 2. **Slide-Out Control Panel**
On mobile devices (screens < 768px):
- Control panel is **hidden by default** - you can interact with the cosmos freely
- **Tap the floating button** to slide the panel in from the left
- **Tap the X button** in the header to close the panel
- **Tap outside the panel** to automatically close it
- Full-screen panel when open for easy control access

### 3. **Touch-Optimized Controls**
- **Larger buttons** (48x48px) for easy tapping
- **Increased padding** on all interactive elements
- **Touch-friendly sliders** with larger touch targets
- **No accidental zooming** - pinch-to-zoom disabled for better control
- **Smooth animations** when opening/closing menus

### 4. **Responsive Layouts**

#### Portrait Mode (< 768px)
- Full-screen slide-out menu
- Stats panel centered at bottom
- Controls fill entire screen when open

#### Landscape Mode (< 768px)
- Menu takes 50% of screen width (max 400px)
- Stats panel positioned on the right
- Better use of horizontal space

#### Tablet (769px - 1024px)
- Wider control panel (360px)
- Desktop-like layout with better spacing

### 5. **Cosmos Interaction**
- **OrbitControls enabled** - touch to rotate the camera view
- **Pinch gestures** for zooming in/out on the visualization
- **Two-finger drag** to pan the camera
- **Full-screen visualization** when menu is closed

## How to Use on Mobile

### iPhone/iPad
1. Open Safari or Chrome
2. Navigate to your visualizer URL
3. Tap the **purple floating button** to open controls
4. Upload audio or use microphone
5. Close the menu by tapping **X** or tapping outside
6. Interact with the cosmos using touch gestures

### Android
1. Open Chrome or Firefox
2. Navigate to your visualizer URL
3. Tap the **menu button** (three horizontal lines)
4. Choose your audio source
5. Close menu and enjoy the visualization
6. Use pinch/drag gestures to explore

## Mobile-Specific Settings

### Recommended Settings for Mobile Performance
- **Node Size**: 0.8 - 1.5 (smaller for better performance)
- **Spawn Rate**: 0.5 - 1.0 (lower for smoother animation)
- **Max Nodes**: Limited to 5000 (automatically managed)
- **Spread**: 30 - 80 (moderate for better visibility)

## Audio Sources on Mobile

### File Upload
- Tap "Upload" button
- Select audio file from your device
- **File Size Limits:**
  - **Mobile (iPhone/Android): 20MB maximum**
  - **Desktop: 100MB maximum**
  - Files larger than limit will show an error

- **Supported formats:**
  - **MP3** (.mp3) - Most common, **BEST for mobile** (small size)
  - **M4A** (.m4a) - Apple/iTunes format, good for iOS
  - **AAC** (.aac) - Advanced Audio Coding, efficient
  - **OGG** (.ogg) - Open source format, compact
  - **OPUS** (.opus) - Modern codec, small files
  - **WAV** (.wav) - Uncompressed, **VERY LARGE** (avoid for long tracks)
  - **FLAC** (.flac) - Lossless compression, large files
  - **AIFF** (.aiff) - Apple format, large files
  - **WMA** (.wma) - Windows Media Audio
  - **WebM** (.webm) - Web format
  - **APE** (.ape) - Monkey's Audio, large files

- **Size Comparison (3-minute song):**
  - MP3 (128kbps): ~3MB ✅ **Recommended**
  - MP3 (320kbps): ~7MB ✅ Good
  - AAC/M4A: ~4MB ✅ Good for iPhone
  - WAV: ~30MB ⚠️ Too large for mobile!
  - FLAC: ~20MB ⚠️ At the limit

### Microphone
- Tap "Mic" button
- Grant microphone permission when prompted
- Visualize live sound from your device's microphone
- Great for visualizing ambient sounds or music playback

### Spotify (Mobile)
- Works the same as desktop
- Paste Spotify URLs
- 30-second previews work without authentication
- Full playback requires Premium + setup

## Performance Tips for Mobile

1. **Close other apps** - Free up device memory
2. **Use headphones** - Better audio quality for microphone mode
3. **Lower settings** - Reduce spawn rate and node size if laggy
4. **Portrait mode** - Often performs better than landscape
5. **Charge your device** - Visualization is GPU-intensive

## Troubleshooting Mobile Issues

### Menu won't open
- Refresh the page
- Check if browser supports JavaScript
- Try a different browser (Chrome/Safari recommended)

### Visualization is laggy
- Lower the spawn rate slider
- Reduce node size
- Close background apps
- Try a newer device

### Can't interact with cosmos
- Make sure the control panel is closed
- Try refreshing the page
- Check if OrbitControls is loading (open browser console)

### Audio not playing
- Check device volume
- Grant microphone permissions if using mic
- Make sure audio file format is supported
- For Spotify, check internet connection

### Large WAV files won't play
- **This is normal!** WAV files are huge (10x larger than MP3)
- **Solution:** Convert to MP3 or M4A before uploading
- **Why:** Mobile browsers have 20MB memory limit
- **Example:** 5-minute WAV = 50MB (too large)
- **Example:** Same song as MP3 = 5MB (works great!)

### How to convert WAV to MP3
**On iPhone:**
1. Use GarageBand app (free)
2. Import WAV file
3. Export as MP3 or M4A

**Online converter:**
- CloudConvert.com
- Online-Convert.com
- FreeConvert.com

**Desktop software:**
- Audacity (free, cross-platform)
- iTunes/Apple Music (Mac)
- Windows Media Player (Windows)

## Browser Compatibility

### Fully Supported
- ✅ Safari (iOS 13+)
- ✅ Chrome (Android 8+)
- ✅ Firefox (Android)
- ✅ Edge (Android)

### Partial Support
- ⚠️ Samsung Internet (some features may be limited)
- ⚠️ Opera Mobile (test before use)

### Not Recommended
- ❌ IE Mobile (not supported)
- ❌ Very old Android browsers (< Android 7)

## Accessibility Features

- **Large touch targets** - Minimum 44x44px per Apple HIG
- **High contrast buttons** - Easy to see in various lighting
- **Haptic feedback** - On supported devices
- **Screen reader support** - Basic ARIA labels
- **No motion sickness triggers** - Smooth, optional camera rotation

## Privacy & Permissions

### Microphone Permission
- Only requested when you tap "Mic" button
- Audio is processed locally - never sent to servers
- Can be revoked in browser settings

### File Access
- Only for files you explicitly select
- Files stay on your device

### Spotify
- Standard OAuth flow
- Token stored in browser localStorage
- Can disconnect anytime

## What's Different from Desktop?

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Control Panel | Always visible | Hidden by default, slide-out |
| Menu Toggle | Settings gear only | Floating button + X close |
| Stats Panel | Bottom-left | Bottom-center |
| Touch Controls | Mouse only | Multi-touch gestures |
| Panel Size | 320px fixed | Full screen or 50% width |
| Scrolling | Smooth scrollbar | Native touch scroll |

## Future Mobile Improvements

Coming soon:
- Swipe gestures to switch modes
- Quick action shortcuts
- Share visualization as video
- Mobile-optimized presets
- Haptic feedback on beats
- Picture-in-picture mode

---

**Enjoy exploring the cosmos on the go!** 🌌📱
