# Spotify Integration Setup Guide

Your Cosmos Audio Visualizer now supports Spotify integration! Here's how to set it up and use it.

## Quick Start (No Setup Required)

You can immediately use Spotify **preview mode** (30-second previews) without any setup:

1. Open the visualizer in your browser
2. Paste a Spotify track URL in the "Spotify Track/Playlist URL" field
3. Click "Load from Spotify"
4. The 30-second preview will play and visualize automatically!

## Full Track Playback (Spotify Premium Required)

For full-length track playback, you'll need to set up Spotify API credentials:

### Step 1: Create a Spotify App

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the details:
   - **App name**: Cosmos Audio Visualizer
   - **App description**: Audio visualization app
   - **Redirect URI**: Add your local URL (e.g., `http://localhost:3000/cosmos-audio-viz.html` or `http://127.0.0.1:5500/cosmos-audio-viz.html`)
   - **Which API/SDKs are you planning to use**: Web Playback SDK
5. Accept the terms and click "Save"
6. Copy your **Client ID**

### Step 2: Configure the Visualizer

1. Open `cosmos-audio-viz.html` in a text editor
2. Find this line (around line 265):
   ```javascript
   const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
   ```
3. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
4. Save the file

### Step 3: Connect to Spotify

1. Open the visualizer in your browser
2. Click "Connect to Spotify"
3. Log in and authorize the app
4. You'll be redirected back to the visualizer
5. The button should now show "Connected to Spotify" in green

### Step 4: Play Spotify Tracks

1. Copy a Spotify track or playlist URL (e.g., `https://open.spotify.com/track/...`)
2. Paste it in the "Spotify Track/Playlist URL" field
3. Click "Load from Spotify"
4. The track will start playing!

## How to Visualize Spotify Audio

Due to browser security restrictions, there are two ways to visualize Spotify audio:

### Option 1: Preview URLs (Easiest)
- Works automatically for tracks with 30-second previews
- No additional setup needed
- Audio analysis works immediately
- Limited to 30 seconds per track

### Option 2: Full Playback with Virtual Audio Cable (Advanced)
For full-length tracks with Spotify Premium:

1. **Install a virtual audio cable**:
   - Windows: [VB-Audio Virtual Cable](https://vb-audio.com/Cable/)
   - Mac: [BlackHole](https://github.com/ExistentialAudio/BlackHole)
   - Linux: PulseAudio loopback

2. **Route Spotify audio**:
   - Set your system audio output to the virtual cable
   - Or configure Spotify to output to the virtual cable

3. **Use Microphone input**:
   - In the visualizer, click "Use Microphone"
   - Select the virtual audio cable as the input
   - The visualization will now respond to Spotify playback!

## Features

### Supported URLs
- Single tracks: `https://open.spotify.com/track/[ID]`
- Playlists: `https://open.spotify.com/playlist/[ID]` (plays first track)

### Controls
- **Connect to Spotify**: Authenticate with your Spotify account
- **Load from Spotify**: Load and play a track from a pasted URL
- **Play/Pause**: Control Spotify playback (when connected)
- **Stop**: Stop playback and clear visualization

## Troubleshooting

### "Please set your Spotify Client ID"
- You need to add your Client ID from the Spotify Developer Dashboard
- See Step 1 and 2 above

### "No preview available for this track"
- Some tracks don't have preview URLs
- Try connecting to Spotify Premium for full playback
- Or choose a different track

### "Spotify Premium is required for playback"
- Full-length playback requires Spotify Premium
- Free users can use preview mode (30 seconds)

### Visualization not working with Spotify
- For preview URLs, visualization works automatically
- For full playback, you need to route system audio (see Option 2 above)
- Alternatively, use local audio files or microphone input

### Authentication errors
- Clear your browser cache and localStorage
- Click "Connect to Spotify" again
- Make sure your Redirect URI matches exactly in the Spotify Dashboard

## Privacy & Security

- Your Spotify access token is stored in browser localStorage
- No data is sent to any third-party servers
- Authentication uses Spotify's official OAuth flow
- Click "Connected to Spotify" to disconnect and clear your token

## Example URLs to Try

- Daft Punk - One More Time: `https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV`
- The Weeknd - Blinding Lights: `https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b`
- Tame Impala - The Less I Know The Better: `https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ`

Enjoy visualizing your Spotify music!
