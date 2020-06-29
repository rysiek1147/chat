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
  socket.on('login', (user) => {
    users.push({name: user, id: socket.id});
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: user + ' has joined the conversation'
    });
  });

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    if(users.some( user => user.id === socket.id)) {
      const user = users.filter( user => user.id === socket.id);
      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: user[0].name + ' has left the conversation'
      });
      users.splice(users.indexOf(user[0]), 1);
    }
  });
})

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
})