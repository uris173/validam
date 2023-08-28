const {Server} = require('socket.io')

let io;

function init_socket(server) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://foodadmin.of-astora.uz'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket.io client connected!');
  });
}

function get_socket() {
  return new Promise((resolve, reject) => {
    if (io) {
      resolve(io)
    } else {
      reject(new Error('Socket.io has not been initialized yet.'))
    }
  })
}


module.exports = {init_socket, get_socket}