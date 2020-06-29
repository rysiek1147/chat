const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);
const messages = [];
const users = [];

io.on('connection', (socket) => {
  console.log('New client! its id - ' + socket.id);
  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { console.log('socket ' + socket.id + ' has left')});
  console.log('add message listener');
})

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
})