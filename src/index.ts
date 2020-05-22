import http from 'http'
import app from './app'
import config from './utils/config'

const PORT = config.get('port')

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
