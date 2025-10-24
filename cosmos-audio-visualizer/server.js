const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 50500;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('===========================================');
    console.log('  Cosmos Audio Visualizer Server');
    console.log('===========================================');
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log('  Press Ctrl+C to stop the server');
    console.log('===========================================');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    process.exit(0);
});
