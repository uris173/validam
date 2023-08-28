const express = require('express')
const app = express()
const mongoose = require('mongoose')
const upload = require('express-fileupload')
const cors = require('cors')
const routers = require('./router')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
require('dotenv').config()

app.use(cors())
app.use(express.json());
app.use(upload())

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://192.168.24.44:8080'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

module.exports = { io }

require('./bot/bot')

app.use('/files',express.static('files'))
app.use(routers)

mongoose.set('strictQuery', false);
const PORT = 3004

io.on('connection', (socket) => { // socket io 
  console.log('Socket.io client connected!');
});

async function dev() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected!'))
    .catch((error) => console.log(error))
    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT} PORT`);
    })
  } catch (error) {
    console.log(error);
  }
}
dev()