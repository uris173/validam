const express = require('express')
const app = express()
const mongoose = require('mongoose')
const upload = require('express-fileupload')
const cors = require('cors')
const routers = require('./router')
const http = require('http')
const server = http.createServer(app)
const {init_socket} = require('./socket')
require('dotenv').config()

init_socket(server)

app.use(cors())
app.use(express.json());
app.use(upload())

require('./bot/bot')

app.use('/files',express.static('files'))
app.use(routers)

mongoose.set('strictQuery', false);
const PORT = 3004

function dev() {
  try {
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
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