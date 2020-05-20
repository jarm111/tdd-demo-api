import express from 'express'
import eventRouter from './routers/eventRouter'
import mongoose from 'mongoose'
import config from './utils/config'

const app = express()
app.use(express.json())

let dbUrl = ''

if (config.get('env') === 'production') {
  dbUrl = config.get('db.prod')
} else if (config.get('env') === 'development') {
  dbUrl = config.get('db.dev')
}

if (!(config.get('env') === 'test')) {
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`connected to ${config.get('env')} DB`)
    })
    .catch((error) => {
      console.log('DB connection error', error.message)
    })
}

app.use('/api/events', eventRouter)

app.get('/ping', (_req, res) => {
  res.send('pong')
})

export default app
