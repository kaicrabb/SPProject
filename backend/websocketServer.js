const WebSocket = require('ws');  // Make sure you have 'ws' installed

const wss = new WebSocket.Server({ noServer: true }); // We pass noServer to integrate with existing server

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send('Hello from server');  // Send a message back to the client
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;
