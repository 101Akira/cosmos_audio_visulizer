# Cosmos Audio Visualizer

An interactive Three.js-based cosmos visualization that generates dynamic 3D nodes based on audio analysis. The visualization maps audio frequency and amplitude data to create a mesmerizing cosmic experience.

## Features

- **Real-time Audio Analysis**: Uses Web Audio API to analyze frequency, amplitude, and stereo channels
- **Multiple Input Sources**: Upload audio files or use microphone input
- **3D Visualization**: Creates dynamic nodes in 3D space mapped to audio characteristics
- **Three Visualization Modes**: Classic frequency bands, BPM-synced beats, and Journey through space
- **Interactive Controls**: Adjust node size, spawn rate, spread, and auto-rotate speed
- **Mouse Controls**: Orbit, zoom, and pan the camera using your mouse
- **Stereo Audio Mapping**: Left/right audio channels are mapped to X-axis positioning
- **3D Coordinate System**: Visual X, Y, Z axes for spatial reference
- **Visual Effects**: Frame-style squares, connecting lines, coordinate labels, and physics-based movement
- **Self-Hosted**: Runs on its own Node.js/Express server

## How Audio Maps to 3D Space

- **Frequency Bands**: The audio spectrum is divided into 8 bands, each mapped to different angular positions
- **Amplitude**: Controls node distance from center, color intensity, and brightness
- **Stereo Positioning**:
  - Audio from left channel → nodes positioned to the left (negative X)
  - Audio from right channel → nodes positioned to the right (positive X)
  - Center/mono audio → nodes centered around origin
- **Color Coding** (based on amplitude intensity):
  - Low amplitude (0-33%) → Blue/Cyan (cold colors)
  - Medium amplitude (33-66%) → Green/Yellow
  - High amplitude (66-100%) → Orange/Red (hot colors)
- **Node Behavior**:
  - Each node is a frame-style square with coordinate labels
  - Physics-based velocity and movement
  - Gradually fades out over time (auto-cleanup)
  - Connected to adjacent nodes with white lines

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. Navigate to the project directory:
```bash
cd cosmos-audio-visualizer
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The server will start on `http://localhost:50500` (or custom port via PORT env variable)

Open your web browser and navigate to:
```
http://localhost:50500
```

## Supported Audio Formats

The visualizer supports a wide range of audio formats through the Web Audio API:

### Most Compatible (Recommended)
- **MP3** (.mp3) - Works everywhere
- **WAV** (.wav) - Uncompressed, high quality
- **M4A** (.m4a) - Apple/iTunes format, excellent for iOS

### High-Quality Formats
- **FLAC** (.flac) - Lossless compression
- **AIFF** (.aiff) - Apple lossless format
- **APE** (.ape) - Monkey's Audio (lossless)

### Modern Codecs
- **OGG** (.ogg) - Ogg Vorbis, open format
- **AAC** (.aac) - Advanced Audio Coding
- **OPUS** (.opus) - Modern low-latency codec
- **WebM** (.webm) - Web-optimized format

### Other Formats
- **WMA** (.wma) - Windows Media Audio

**Note for iPhone/iOS users:** All formats are supported, but MP3, WAV, and M4A provide the best compatibility. The file picker will show all audio files regardless of extension.

## Usage

1. **Upload Audio File**: Click "Upload Audio File" to select an audio file from your device
2. **Use Microphone**: Click "Use Microphone" for real-time visualization of audio input
3. **Play/Pause**: Control playback of uploaded audio files
4. **Mouse Controls**:
   - **Left Click + Drag**: Rotate/orbit the camera around the scene
   - **Right Click + Drag**: Pan the camera
   - **Scroll Wheel**: Zoom in/out
5. **Select Visualization Mode**:
   - **Classic**: Continuous frequency band spawning
   - **BPM Sync**: Spawn only on detected beats
   - **Journey**: Travel forward through space (camera flies through nodes)
6. **Adjust Settings**:
   - **Node Size**: Change the size of generated nodes (0.5 - 3.0)
   - **Spawn Rate**: Control how quickly nodes are created (0.1 - 3.0)
   - **Spread**: Adjust spatial distribution (10 - 200)
   - **Auto-Rotate Speed**: Enable/control automatic camera rotation (0 = off, 0.1 - 3.0)
   - **Node Lifetime**: Control how long nodes stay visible (2-30 seconds)

## Visualization Modes

### **Classic Mode**
- **Spawning**: Continuous based on frequency bands (8 bands)
- **Camera**: Stationary at origin, full mouse orbit controls
- **Node Position**: Arranged in circular patterns around origin
- **Best For**: General music visualization, exploring stereo separation

### **BPM Sync Mode**
- **Spawning**: Only on detected beats (real-time beat detection)
- **Camera**: Same as Classic mode
- **Node Position**: Same as Classic, but rhythmic bursts
- **BPM Display**: Shows detected tempo in stats panel
- **Best For**: Electronic music, rhythmic tracks, visualizing percussion

### **Journey Mode** 🚀
- **Spawning**: Nodes spawn ahead of camera as it travels
- **Camera**: Travels forward along Z-axis continuously
- **Movement Speed**: Configurable in code (`journeySystem.speed`)
- **Mouse Controls**:
  - **Enabled**: You can orbit and look around while traveling
  - **Target**: Follows the traveling reference point (stays relative)
  - **Effect**: Like looking around inside a moving spaceship
- **Node Behavior**: Nodes remain in absolute position as camera passes
- **Visual Effect**: Creates "tunnel through space" or "hyperspace jump" feeling
- **Best For**: Cinematic experience, long tracks, feeling immersed in the music

#### Journey Mode Customization
Edit in `visualizer.js` line ~158:
```javascript
journeySystem = {
    speed: 0.5,           // 0.1 = slow cruise, 2.0 = fast travel
    spawnDistance: 10,    // How far ahead to spawn nodes
    axis: 'z'             // Travel direction
}
```

## Technical Details

### Stack
- **Backend**: Node.js with Express
- **Frontend**: Three.js (WebGL), Web Audio API
- **No database required**: Completely self-contained

### File Structure
```
cosmos-audio-visualizer/
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── README.md             # Documentation
└── public/               # Static files
    ├── index.html        # Main HTML page
    ├── css/
    │   └── style.css     # Styling
    └── js/
        └── visualizer.js # Three.js and audio visualization logic
```

### Performance
- Maximum of 5000 active nodes
- Automatic node cleanup (particles fade out over time)
- Optimized rendering with Three.js

## Customization

You can modify the following in `public/js/visualizer.js`:

- `maxNodes`: Maximum number of active nodes (default: 5000)
- `analyser.fftSize`: FFT size for frequency analysis (default: 2048)
- Number of frequency bands (default: 8)
- Camera orbit radius (default: 50 units)
- Node decay rate and physics parameters

## Browser Support

Requires a modern browser with support for:
- WebGL
- Web Audio API
- ES6 JavaScript

Tested on:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Port Configuration

The default port is 50500. To use a different port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Troubleshooting

### Microphone not working
- Ensure browser has microphone permissions
- HTTPS may be required for microphone access (use localhost for development)

### No audio playback
- Check browser console for errors
- Ensure audio file format is supported (see "Supported Audio Formats" section above)
- Try clicking the page before playing (some browsers require user interaction)

### Upload button only shows videos on iPhone
- This is fixed! The file picker now explicitly supports all audio formats
- If you still see issues, try using Safari instead of Chrome on iOS
- MP3, WAV, and M4A files should always appear

### Performance issues
- Lower the spawn rate slider
- Reduce the spread slider
- Close other browser tabs

## License

MIT
