const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', (ws) => {
  console.log('New client connected on' + port);

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected with port' + port);
  });
});

console.log('WebSocket server started on ws://localhost:' + port);
