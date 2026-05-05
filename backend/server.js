const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let messages = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send existing messages to newly connected client
  socket.emit('initial_messages', messages);

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    const newMessage = {
      id: Date.now().toString(),
      name: data.name,
      message: data.message,
      color: data.color || '#ffffff',
      timestamp: new Date()
    };
    
    // Keep only the last 50 messages to prevent memory overload
    messages.push(newMessage);
    if (messages.length > 50) {
      messages.shift();
    }

    // Broadcast to all clients
    io.emit('new_message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
