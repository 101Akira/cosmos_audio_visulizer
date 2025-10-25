// Three.js Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Orbit Controls for mouse interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 200;
controls.autoRotate = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 100);
pointLight1.position.set(20, 20, 20);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xec4899, 1, 100);
pointLight2.position.set(-20, -20, -20);
scene.add(pointLight2);

// Create 3D Coordinate Axes
function createAxes() {
    const axesGroup = new THREE.Group();
    const axisLength = 100;
    const axisWidth = 2;

    // X Axis (Red)
    const xGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(axisLength, 0, 0)
    ]);
    const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: axisWidth });
    const xAxis = new THREE.Line(xGeometry, xMaterial);
    axesGroup.add(xAxis);

    // X Label
    const xLabel = createTextLabel('X', new THREE.Vector3(axisLength + 5, 0, 0), 0xff0000);
    axesGroup.add(xLabel);

    // Y Axis (Green)
    const yGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, axisLength, 0)
    ]);
    const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: axisWidth });
    const yAxis = new THREE.Line(yGeometry, yMaterial);
    axesGroup.add(yAxis);

    // Y Label
    const yLabel = createTextLabel('Y', new THREE.Vector3(0, axisLength + 5, 0), 0x00ff00);
    axesGroup.add(yLabel);

    // Z Axis (Blue)
    const zGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, axisLength)
    ]);
    const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: axisWidth });
    const zAxis = new THREE.Line(zGeometry, zMaterial);
    axesGroup.add(zAxis);

    // Z Label
    const zLabel = createTextLabel('Z', new THREE.Vector3(0, 0, axisLength + 5), 0x0000ff);
    axesGroup.add(zLabel);

    return axesGroup;
}

function createTextLabel(text, position, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;

    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'Bold 48px Arial';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 10, 1);
    sprite.position.copy(position);

    return sprite;
}

const coordinateAxes = createAxes();
scene.add(coordinateAxes);

// Audio Setup
let audioContext;
let analyser;
let analyserLeft;
let analyserRight;
let splitter;
let dataArray;
let dataArrayLeft;
let dataArrayRight;
let bufferLength;
let source;
let audioElement;
let isPlaying = false;
let isMicMode = false;

// Visualization variables
const nodes = [];
const maxNodes = 5000;
let spawnCounter = 0;
let cameraAngle = 0;
const connectionLines = new THREE.Group();
scene.add(connectionLines);

// Settings
let settings = {
    nodeSize: 1.0,
    spawnRate: 1.0,
    spread: 50,
    cameraSpeed: 0.0,
    lifetime: 2.0,  // EDIT THIS VALUE: Node lifetime in seconds (affects decay rate) - Now capped at 5s
    mode: 'classic'
};

// Microphone stream reference
let micStream = null;

// Spotify Configuration
// IMPORTANT: Replace this with your own Spotify Client ID
// Get one at: https://developer.spotify.com/dashboard
const SPOTIFY_CLIENT_ID = '51027d9b4b574cb28b41b1fb607b67f8';
const SPOTIFY_REDIRECT_URI = window.location.origin;
let spotifyAccessToken = null;
let spotifyPlayer = null;
let spotifyDeviceId = null;

// BPM Detection variables
let bpmDetector = {
    peaks: [],
    bpm: 120,
    lastBeatTime: 0,
    beatInterval: 500,
    energyHistory: [],
    threshold: 0
};

// Journey Mode variables
let journeySystem = {
    position: 0,           // Current position along Z-axis
    speed: 0.5,           // Travel speed (units per frame) - EDIT THIS
    spawnDistance: 10,    // Distance ahead to spawn nodes
    axis: 'z'             // Travel axis: 'x', 'y', or 'z'
};

// Node class
class CosmicNode {
    constructor(frequency, amplitude, position) {
        // Create smaller frame-like square
        const size = 0.8 * settings.nodeSize;

        // Color based on amplitude intensity (low = blue/cold, high = red/hot)
        const color = new THREE.Color();
        if (amplitude < 0.33) {
            // Low amplitude: blue to cyan
            color.setHSL(0.55 + amplitude * 0.3, 1, 0.5);
        } else if (amplitude < 0.66) {
            // Medium amplitude: green to yellow
            color.setHSL(0.4 - (amplitude - 0.33) * 0.5, 1, 0.5);
        } else {
            // High amplitude: orange to red
            color.setHSL(0.08 - (amplitude - 0.66) * 0.2, 1, 0.5);
        }

        // Create a group to hold all visual elements
        this.mesh = new THREE.Group();
        this.mesh.position.copy(position);

        // 1. Outer frame (main square)
        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const edges = new THREE.EdgesGeometry(planeGeometry);
        const frameMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            linewidth: 4  // EDIT THIS VALUE: Line thickness (try 2-10)
        });
        const frame = new THREE.LineSegments(edges, frameMaterial);
        this.mesh.add(frame);
        planeGeometry.dispose();

        // 2. Inner frame (concentric square)
        const innerSize = size * 0.6;
        const innerGeometry = new THREE.PlaneGeometry(innerSize, innerSize);
        const innerEdges = new THREE.EdgesGeometry(innerGeometry);
        const innerMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            linewidth: 2
        });
        const innerFrame = new THREE.LineSegments(innerEdges, innerMaterial);
        this.mesh.add(innerFrame);
        innerGeometry.dispose();

        // 3. Glow effect for high amplitude
        if (amplitude > 0.5) {
            const glowSize = size * 1.3;
            const glowGeometry = new THREE.PlaneGeometry(glowSize, glowSize);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: (amplitude - 0.5) * 0.3,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.mesh.add(glow);
            this.glowMesh = glow;
        }

        this.frameMaterial = frameMaterial;
        this.innerMaterial = innerMaterial;

        // Create text label with coordinates
        this.createLabel(position);

        // REMOVED: Node velocity - nodes now stay in place
        // If you want nodes to wander, uncomment these lines:
        // this.velocity = new THREE.Vector3(
        //     (Math.random() - 0.5) * amplitude * 0.5,
        //     (Math.random() - 0.5) * amplitude * 0.5,
        //     (Math.random() - 0.5) * amplitude * 0.5
        // );

        this.life = 1.0;
        // Calculate decay rate based on lifetime setting (60 FPS assumed)
        this.decay = 1.0 / (settings.lifetime * 60);
        this.amplitude = amplitude;

        scene.add(this.mesh);
    }

    createLabel(position) {
        // Create canvas for text (smaller text)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = 'Bold 14px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        const text = `(${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)})`;
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        this.label = new THREE.Sprite(spriteMaterial);
        this.label.scale.set(5, 1.25, 1);
        this.label.position.copy(position);
        this.label.position.y -= 1.5; // Position below the square

        scene.add(this.label);
    }

    update() {
        // REMOVED: Node movement - they stay at spawn position
        // If you want movement, uncomment: this.mesh.position.add(this.velocity);

        this.life -= this.decay;

        // Update all materials with fading
        if (this.frameMaterial) {
            this.frameMaterial.opacity = this.life * 0.9;
        }
        if (this.innerMaterial) {
            this.innerMaterial.opacity = this.life * 0.5;
        }
        if (this.glowMesh) {
            this.glowMesh.material.opacity = this.life * (this.amplitude - 0.5) * 0.3;
        }

        // Update label opacity (position stays fixed)
        if (this.label) {
            this.label.material.opacity = this.life * 0.9;
        }

        // Make square always face camera
        this.mesh.lookAt(camera.position);

        return this.life > 0;
    }

    destroy() {
        // Remove mesh group and dispose all children
        this.mesh.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        scene.remove(this.mesh);

        if (this.label) {
            scene.remove(this.label);
            this.label.material.map.dispose();
            this.label.material.dispose();
        }
    }
}

// Initialize audio context with stereo analysis
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Main analyser
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Stereo split for spatial audio
        splitter = audioContext.createChannelSplitter(2);

        // Left channel analyser
        analyserLeft = audioContext.createAnalyser();
        analyserLeft.fftSize = 2048;
        dataArrayLeft = new Uint8Array(analyserLeft.frequencyBinCount);

        // Right channel analyser
        analyserRight = audioContext.createAnalyser();
        analyserRight.fftSize = 2048;
        dataArrayRight = new Uint8Array(analyserRight.frequencyBinCount);
    }
}

// File upload handler
document.getElementById('uploadBtn').addEventListener('click', () => {
    document.getElementById('audioFile').click();
});

document.getElementById('audioFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Check file size (20MB limit for mobile, 100MB for desktop)
        const maxSize = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 20 * 1024 * 1024 : 100 * 1024 * 1024;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
            alert(`File too large: ${fileSizeMB}MB\n\nMaximum size on this device: ${maxSizeMB}MB\n\nTips:\n• Use MP3 instead of WAV (much smaller)\n• Compress/convert your audio file\n• Try a shorter clip`);
            document.getElementById('status').textContent = `File too large: ${fileSizeMB}MB (max: ${maxSizeMB}MB)`;
            return;
        }

        stopAudio();
        isMicMode = false;

        if (audioElement) {
            audioElement.pause();
            audioElement = null;
        }

        audioElement = new Audio();
        audioElement.src = URL.createObjectURL(file);

        // Add error handler for loading issues
        audioElement.addEventListener('error', (err) => {
            console.error('Audio loading error:', err);
            document.getElementById('status').textContent = `Error loading ${file.name}`;
            alert(`Failed to load audio file.\n\nPossible causes:\n• File corrupted or unsupported format\n• Not enough memory (try a smaller file)\n• Browser limitation\n\nTry converting to MP3 or using a smaller file.`);
        });

        initAudioContext();

        if (source) {
            source.disconnect();
        }

        source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        source.connect(splitter);
        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);
        analyser.connect(audioContext.destination);

        document.getElementById('status').textContent = `Loaded: ${file.name} (${fileSizeMB}MB)`;
        document.getElementById('playPauseBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false;
    }
});

// Microphone handler
document.getElementById('micBtn').addEventListener('click', async () => {
    try {
        stopAudio();
        isMicMode = true;

        initAudioContext();

        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (source) {
            source.disconnect();
        }

        source = audioContext.createMediaStreamSource(micStream);
        source.connect(analyser);
        source.connect(splitter);
        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);

        isPlaying = true;
        document.getElementById('status').textContent = 'Microphone Active';
        document.getElementById('playPauseBtn').disabled = true;
        document.getElementById('stopBtn').disabled = true;

        // Show mic stop button, hide mic start button
        document.getElementById('micBtn').style.display = 'none';
        document.getElementById('micStopBtn').style.display = 'block';
        document.getElementById('micStopBtn').disabled = false;
    } catch (err) {
        document.getElementById('status').textContent = 'Microphone access denied';
        console.error('Microphone error:', err);
    }
});

// Microphone stop handler
document.getElementById('micStopBtn').addEventListener('click', () => {
    if (micStream) {
        // Stop all tracks in the stream
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }

    stopAudio();
    isMicMode = false;

    // Show mic start button, hide mic stop button
    document.getElementById('micBtn').style.display = 'block';
    document.getElementById('micStopBtn').style.display = 'none';
    document.getElementById('status').textContent = 'Microphone Stopped';
});

// Play/Pause handler
document.getElementById('playPauseBtn').addEventListener('click', () => {
    if (!audioElement) return;

    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
        document.getElementById('playPauseBtn').textContent = 'Play';
        document.getElementById('status').textContent = 'Paused';
    } else {
        audioElement.play();
        isPlaying = true;
        document.getElementById('playPauseBtn').textContent = 'Pause';
        document.getElementById('status').textContent = 'Playing';
    }
});

// Stop handler
document.getElementById('stopBtn').addEventListener('click', () => {
    stopAudio();
});

function stopAudio() {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
    isPlaying = false;
    document.getElementById('playPauseBtn').textContent = 'Play';
    document.getElementById('status').textContent = 'Stopped';

    // Clear all nodes
    nodes.forEach(node => node.destroy());
    nodes.length = 0;

    // Clear connection lines
    while (connectionLines.children.length > 0) {
        const line = connectionLines.children[0];
        connectionLines.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    }

    // Reset journey position
    journeySystem.position = 0;

    // Reset camera and controls target
    camera.position.set(0, 0, 50);
    controls.target.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
}

// Slider handlers
document.getElementById('nodeSize').addEventListener('input', (e) => {
    settings.nodeSize = parseFloat(e.target.value);
    document.getElementById('nodeSizeValue').textContent = settings.nodeSize.toFixed(1);
});

document.getElementById('spawnRate').addEventListener('input', (e) => {
    settings.spawnRate = parseFloat(e.target.value);
    document.getElementById('spawnRateValue').textContent = settings.spawnRate.toFixed(1);
});

document.getElementById('spread').addEventListener('input', (e) => {
    settings.spread = parseInt(e.target.value);
    document.getElementById('spreadValue').textContent = settings.spread;
});

document.getElementById('cameraSpeed').addEventListener('input', (e) => {
    settings.cameraSpeed = parseFloat(e.target.value);
    document.getElementById('cameraSpeedValue').textContent = settings.cameraSpeed.toFixed(1);
});

document.getElementById('lifetime').addEventListener('input', (e) => {
    // Logarithmic scale: 0-100 slider maps to 0.5-5 seconds
    // Formula: lifetime = 0.5 + (4.5 * (sliderValue/100)^2)
    const sliderValue = parseFloat(e.target.value);
    const normalizedValue = sliderValue / 100; // 0 to 1
    settings.lifetime = 0.5 + (4.5 * Math.pow(normalizedValue, 2));
    document.getElementById('lifetimeValue').textContent = settings.lifetime.toFixed(1) + 's';
});

document.getElementById('journeySpeed').addEventListener('input', (e) => {
    journeySystem.speed = parseFloat(e.target.value);
    document.getElementById('journeySpeedValue').textContent = journeySystem.speed.toFixed(1);
});

document.getElementById('modeSelect').addEventListener('change', (e) => {
    settings.mode = e.target.value;
    console.log('Mode changed to:', settings.mode);

    // Reset journey position when changing modes
    journeySystem.position = 0;

    // Reset camera and controls target
    camera.position.set(0, 0, 50);
    controls.target.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
});

// Update connection lines between nodes
function updateConnectionLines() {
    // Clear existing lines
    while (connectionLines.children.length > 0) {
        const line = connectionLines.children[0];
        connectionLines.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    }

    // Create lines between consecutive nodes
    for (let i = 0; i < nodes.length - 1; i++) {
        const currentNode = nodes[i];
        const nextNode = nodes[i + 1];

        const points = [];
        points.push(currentNode.mesh.position);
        points.push(nextNode.mesh.position);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Lines are brighter when nodes are fresh, fade as nodes age
        const avgLife = (currentNode.life + nextNode.life) / 2;
        const baseOpacity = 0.8; // More visible base opacity
        const fadeOpacity = avgLife * baseOpacity;

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: fadeOpacity,
            linewidth: 2  // EDIT THIS: Connection line thickness
        });

        const line = new THREE.Line(geometry, material);
        connectionLines.add(line);
    }
}

// BPM Detection using beat tracking
function detectBeat() {
    // Don't call getByteFrequencyData here - data is already loaded

    // Calculate energy in bass frequencies (0-200 Hz range)
    const bassRange = Math.floor(bufferLength * 0.1);
    let bassEnergy = 0;
    for (let i = 0; i < bassRange; i++) {
        bassEnergy += dataArray[i];
    }
    bassEnergy /= bassRange;

    // Track energy history for threshold calculation
    bpmDetector.energyHistory.push(bassEnergy);
    if (bpmDetector.energyHistory.length > 43) { // ~0.7 seconds at 60fps
        bpmDetector.energyHistory.shift();
    }

    // Calculate dynamic threshold (lowered to 1.15 for more sensitive detection)
    const avgEnergy = bpmDetector.energyHistory.reduce((a, b) => a + b, 0) / bpmDetector.energyHistory.length;
    bpmDetector.threshold = avgEnergy * 1.15;  // EDIT THIS: Lower = more sensitive (1.1-1.5)

    // Detect beat
    const now = Date.now();
    const minTimeBetweenBeats = 200; // 300 BPM max

    if (bassEnergy > bpmDetector.threshold &&
        now - bpmDetector.lastBeatTime > minTimeBetweenBeats) {

        // Record beat
        bpmDetector.peaks.push(now);
        bpmDetector.lastBeatTime = now;

        // Keep only recent peaks (last 10 seconds)
        bpmDetector.peaks = bpmDetector.peaks.filter(time => now - time < 10000);

        // Calculate BPM from recent peaks
        if (bpmDetector.peaks.length > 2) {
            const intervals = [];
            for (let i = 1; i < bpmDetector.peaks.length; i++) {
                intervals.push(bpmDetector.peaks[i] - bpmDetector.peaks[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            bpmDetector.bpm = Math.round(60000 / avgInterval);
            bpmDetector.beatInterval = avgInterval;
        }

        return true; // Beat detected
    }

    return false;
}

// Create new nodes based on audio data with stereo positioning
function createNodesFromAudio() {
    if (!analyser || (!isPlaying && !isMicMode)) return;

    analyser.getByteFrequencyData(dataArray);

    // Mode-specific behavior
    if (settings.mode === 'bpm') {
        const beatDetected = detectBeat();

        // Only spawn on beat in BPM mode
        if (!beatDetected) return;
    }

    // Get stereo channel data
    if (analyserLeft && analyserRight) {
        analyserLeft.getByteFrequencyData(dataArrayLeft);
        analyserRight.getByteFrequencyData(dataArrayRight);
    }

    // Calculate average amplitude
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    const avgAmplitude = sum / bufferLength / 255;

    // Calculate stereo balance
    let leftSum = 0, rightSum = 0;
    if (dataArrayLeft && dataArrayRight) {
        for (let i = 0; i < bufferLength; i++) {
            leftSum += dataArrayLeft[i];
            rightSum += dataArrayRight[i];
        }
    }
    const leftAvg = leftSum / bufferLength / 255;
    const rightAvg = rightSum / bufferLength / 255;
    const stereoBalance = (rightAvg - leftAvg); // -1 (left) to +1 (right)

    // Update stats
    document.getElementById('ampDisplay').textContent = (avgAmplitude * 100).toFixed(1);

    // Spawn nodes based on frequency bands
    spawnCounter += settings.spawnRate;

    if (spawnCounter >= 1 && avgAmplitude > 0.05) {
        const nodesToSpawn = Math.floor(spawnCounter);
        spawnCounter -= nodesToSpawn;

        const bands = 8; // Divide frequency spectrum into bands
        const bandSize = Math.floor(bufferLength / bands);

        for (let band = 0; band < bands; band++) {
            const startIdx = band * bandSize;
            const endIdx = startIdx + bandSize;

            let bandSum = 0;
            let maxFreq = 0;
            for (let i = startIdx; i < endIdx; i++) {
                bandSum += dataArray[i];
                if (dataArray[i] > maxFreq) maxFreq = dataArray[i];
            }
            const bandAvg = bandSum / bandSize / 255;

            if (bandAvg > 0.1) {
                // Map frequency band to 3D position
                const angle = (band / bands) * Math.PI * 2;
                const radius = bandAvg * settings.spread;

                // Use stereo balance to position on X axis
                const stereoX = stereoBalance * settings.spread;

                let position;

                if (settings.mode === 'journey') {
                    // In Journey mode, spawn nodes ahead of the camera's current position
                    const spawnZ = journeySystem.position + journeySystem.spawnDistance;
                    position = new THREE.Vector3(
                        stereoX + Math.cos(angle) * radius * 0.5 + (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * settings.spread * bandAvg,
                        spawnZ + Math.sin(angle) * radius * 0.3 + (Math.random() - 0.5) * 10
                    );
                } else {
                    // Classic and BPM modes: spawn around origin
                    position = new THREE.Vector3(
                        stereoX + Math.cos(angle) * radius * 0.5 + (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * settings.spread * bandAvg,
                        Math.sin(angle) * radius + (Math.random() - 0.5) * 10
                    );
                }

                const node = new CosmicNode(maxFreq, bandAvg, position);
                nodes.push(node);

                // Display dominant frequency
                if (bandAvg === avgAmplitude) {
                    const freqHz = ((startIdx + endIdx) / 2) * (audioContext.sampleRate / analyser.fftSize);
                    document.getElementById('freqDisplay').textContent = freqHz.toFixed(0);
                }
            }
        }
    }

    // Remove old nodes
    while (nodes.length > maxNodes) {
        const node = nodes.shift();
        node.destroy();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Create new nodes
    createNodesFromAudio();

    // Update existing nodes
    for (let i = nodes.length - 1; i >= 0; i--) {
        if (!nodes[i].update()) {
            nodes[i].destroy();
            nodes.splice(i, 1);
        }
    }

    // Update connection lines
    updateConnectionLines();

    // Update stats
    document.getElementById('nodeCount').textContent = nodes.length;
    document.getElementById('bpmDisplay').textContent = bpmDetector.bpm || '--';

    // Journey Mode: Move camera along axis
    if (settings.mode === 'journey' && (isPlaying || isMicMode)) {
        // Update journey position
        journeySystem.position += journeySystem.speed;

        // Update orbit controls target to follow the journey
        controls.target.set(0, 0, journeySystem.position + 20);

        // Enable orbit controls so user can look around
        controls.enabled = true;
        controls.update();

        // Optionally keep camera's Z position relative to journey
        // This allows user to orbit but stay "with" the traveling system
        if (camera.position.z < journeySystem.position - 30) {
            camera.position.z = journeySystem.position - 30;
        }
    } else {
        // Enable orbit controls for other modes
        controls.target.set(0, 0, 0);
        controls.enabled = true;
        controls.autoRotate = settings.cameraSpeed > 0;
        controls.autoRotateSpeed = settings.cameraSpeed * 2;
        controls.update();
    }

    // Update lights based on mode
    if (settings.mode === 'journey') {
        // In journey mode, lights follow the camera
        pointLight1.position.x = Math.sin(Date.now() * 0.001) * 30;
        pointLight1.position.z = journeySystem.position + Math.cos(Date.now() * 0.001) * 30;
        pointLight2.position.x = Math.sin(Date.now() * 0.001 + Math.PI) * 30;
        pointLight2.position.z = journeySystem.position + Math.cos(Date.now() * 0.001 + Math.PI) * 30;
    } else {
        // Classic modes: lights orbit around origin
        pointLight1.position.x = Math.sin(Date.now() * 0.001) * 30;
        pointLight1.position.z = Math.cos(Date.now() * 0.001) * 30;
        pointLight2.position.x = Math.sin(Date.now() * 0.001 + Math.PI) * 30;
        pointLight2.position.z = Math.cos(Date.now() * 0.001 + Math.PI) * 30;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// ==================== UI INTERACTIONS ====================

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileClose = document.getElementById('mobileClose');
const controlsPanel = document.getElementById('controls');

function toggleMobileMenu() {
    controlsPanel.classList.toggle('mobile-hidden');
    controlsPanel.classList.toggle('mobile-visible');
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileClose) {
    mobileClose.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking outside on mobile
if (window.innerWidth <= 768) {
    document.addEventListener('click', (e) => {
        if (controlsPanel.classList.contains('mobile-visible') &&
            !controlsPanel.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

// Settings toggle button
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');

settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('collapsed');

    // Rotate the settings icon
    if (settingsPanel.classList.contains('collapsed')) {
        settingsToggle.style.transform = 'rotate(0deg)';
    } else {
        settingsToggle.style.transform = 'rotate(90deg)';
    }
});

// Collapsible settings sections
const settingsSectionHeaders = document.querySelectorAll('.settings-section-header');

settingsSectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const isExpanded = content.classList.contains('expanded');

        // Toggle this section
        if (isExpanded) {
            content.classList.remove('expanded');
            header.classList.remove('active');
        } else {
            content.classList.add('expanded');
            header.classList.add('active');
        }
    });
});

// Open first section by default
const firstSection = document.querySelector('.settings-section-header');
if (firstSection) {
    firstSection.click();
}

// ==================== SPOTIFY INTEGRATION ====================

// Check for access token in URL (OAuth redirect)
function checkSpotifyAuth() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
        spotifyAccessToken = token;
        localStorage.setItem('spotify_access_token', token);
        window.location.hash = ''; // Clear the hash
        initSpotifyPlayer();
        document.getElementById('spotifyAuthBtn').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Connected
        `;
        document.getElementById('spotifyAuthBtn').style.background = 'rgba(30, 215, 96, 0.2)';
        document.getElementById('spotifyAuthBtn').style.borderColor = 'rgba(30, 215, 96, 0.4)';
    } else {
        // Check if we have a stored token
        const storedToken = localStorage.getItem('spotify_access_token');
        if (storedToken) {
            spotifyAccessToken = storedToken;
            initSpotifyPlayer();
            document.getElementById('spotifyAuthBtn').innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Connected
            `;
            document.getElementById('spotifyAuthBtn').style.background = 'rgba(30, 215, 96, 0.2)';
            document.getElementById('spotifyAuthBtn').style.borderColor = 'rgba(30, 215, 96, 0.4)';
        }
    }
}

// Spotify authentication
document.getElementById('spotifyAuthBtn').addEventListener('click', () => {
    if (spotifyAccessToken) {
        // Already authenticated, disconnect
        spotifyAccessToken = null;
        localStorage.removeItem('spotify_access_token');
        document.getElementById('spotifyAuthBtn').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
            </svg>
            Connect
        `;
        document.getElementById('spotifyAuthBtn').style.background = '';
        document.getElementById('spotifyAuthBtn').style.borderColor = '';
        if (spotifyPlayer) {
            spotifyPlayer.disconnect();
            spotifyPlayer = null;
        }
        return;
    }

    if (SPOTIFY_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        alert('Please set your Spotify Client ID in visualizer.js\n\n1. Go to https://developer.spotify.com/dashboard\n2. Create an app\n3. Add ' + window.location.origin + ' as redirect URI\n4. Copy the Client ID\n5. Replace YOUR_CLIENT_ID_HERE in /js/visualizer.js');
        return;
    }

    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state'
    ];

    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${SPOTIFY_CLIENT_ID}` +
        `&response_type=token` +
        `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scopes.join(' '))}`;

    window.location.href = authUrl;
});

// Initialize Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    if (spotifyAccessToken) {
        initSpotifyPlayer();
    }
};

function initSpotifyPlayer() {
    if (!spotifyAccessToken || spotifyPlayer) return;

    spotifyPlayer = new Spotify.Player({
        name: 'Cosmos Audio Visualizer',
        getOAuthToken: cb => { cb(spotifyAccessToken); },
        volume: 0.8
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Spotify initialization error:', message);
    });
    spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Spotify authentication error:', message);
        localStorage.removeItem('spotify_access_token');
        spotifyAccessToken = null;
    });
    spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Spotify account error:', message);
        alert('Spotify Premium is required for full playback. Using preview mode instead.');
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Spotify player ready with device ID:', device_id);
        spotifyDeviceId = device_id;
    });

    // Player state changes
    spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;

        const track = state.track_window.current_track;
        document.getElementById('status').textContent =
            `Spotify: ${track.name} - ${track.artists[0].name}`;

        isPlaying = !state.paused;
        document.getElementById('playPauseBtn').textContent = isPlaying ? 'Pause' : 'Play';
    });

    spotifyPlayer.connect();
}

// Load Spotify track/playlist
document.getElementById('spotifyBtn').addEventListener('click', async () => {
    const url = document.getElementById('spotifyUrl').value.trim();
    if (!url) {
        alert('Please paste a Spotify URL');
        return;
    }

    // Extract Spotify URI from URL
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);

    if (trackMatch) {
        const trackId = trackMatch[1];
        await loadSpotifyTrack(trackId);
    } else if (playlistMatch) {
        const playlistId = playlistMatch[1];
        await loadSpotifyPlaylist(playlistId);
    } else {
        alert('Invalid Spotify URL. Please paste a track or playlist link.');
    }
});

// Load Spotify track
async function loadSpotifyTrack(trackId) {
    try {
        // If authenticated with Premium, use Web Playback SDK
        if (spotifyAccessToken && spotifyDeviceId) {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${spotifyAccessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [`spotify:track:${trackId}`]
                })
            });

            if (response.ok) {
                isPlaying = true;
                document.getElementById('playPauseBtn').disabled = false;
                document.getElementById('stopBtn').disabled = false;
                document.getElementById('status').textContent = 'Loading Spotify track...';

                // Note: For full audio analysis, users need to route system audio
                setTimeout(() => {
                    alert('Spotify is now playing!\n\nNote: To visualize Spotify audio, you need to:\n1. Use a virtual audio cable (like VB-Cable)\n2. Route Spotify output to the cable\n3. Select the cable as input when clicking "Mic"');
                }, 1000);
            } else {
                throw new Error('Failed to play track');
            }
        } else {
            // Fallback: Try to get preview URL
            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: spotifyAccessToken ? {
                    'Authorization': `Bearer ${spotifyAccessToken}`
                } : {}
            });

            const data = await response.json();

            if (data.preview_url) {
                // Use 30-second preview
                stopAudio();
                isMicMode = false;

                if (audioElement) {
                    audioElement.pause();
                    audioElement = null;
                }

                audioElement = new Audio();
                audioElement.src = data.preview_url;
                audioElement.crossOrigin = "anonymous";

                initAudioContext();

                if (source) {
                    source.disconnect();
                }

                source = audioContext.createMediaElementSource(audioElement);
                source.connect(analyser);
                source.connect(splitter);
                splitter.connect(analyserLeft, 0);
                splitter.connect(analyserRight, 1);
                analyser.connect(audioContext.destination);

                audioElement.play();
                isPlaying = true;

                document.getElementById('status').textContent =
                    `Spotify Preview: ${data.name} - ${data.artists[0].name} (30s)`;
                document.getElementById('playPauseBtn').disabled = false;
                document.getElementById('stopBtn').disabled = false;
                document.getElementById('playPauseBtn').innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    Pause
                `;
            } else {
                alert('No preview available for this track.\n\nPlease:\n1. Connect to Spotify (requires Premium)\n2. Or choose a different track');
            }
        }
    } catch (error) {
        console.error('Error loading Spotify track:', error);
        document.getElementById('status').textContent = 'Error loading track';
        alert('Error loading Spotify track. Please try again or check your connection.');
    }
}

// Load Spotify playlist
async function loadSpotifyPlaylist(playlistId) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: spotifyAccessToken ? {
                'Authorization': `Bearer ${spotifyAccessToken}`
            } : {}
        });

        const data = await response.json();

        if (data.tracks && data.tracks.items.length > 0) {
            // Play first track
            const firstTrackId = data.tracks.items[0].track.id;
            await loadSpotifyTrack(firstTrackId);

            document.getElementById('status').textContent +=
                ` (Playlist: ${data.name}, ${data.tracks.total} tracks)`;
        } else {
            alert('Playlist is empty or unavailable');
        }
    } catch (error) {
        console.error('Error loading Spotify playlist:', error);
        alert('Error loading playlist. Please check the URL and try again.');
    }
}

// Check for Spotify auth on load
checkSpotifyAuth();

console.log('Cosmos Audio Visualizer loaded. Upload an audio file or use your microphone to begin!');
