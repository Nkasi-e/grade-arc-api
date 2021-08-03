require('rootpath')()
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('_middleware/error-handler')

const server = http.createServer(app)

const io = require('socket.io')(server, {
  maxHttpBufferSize: 5e7,
  cors: {
    origin: '*',
  },
})

// connection auth middleware
io.use(require('./websocket/middleware/auth'))

require('./websocket/index')(io)
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const routes = require('./routes')
// api routes
app.use('/api/v1', routes)

// global error handler
app.use(errorHandler)

// start server
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000
server.listen(port, () => console.log('Server listening on port ' + port))
