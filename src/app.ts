import express from 'express'
import eventRouter from './routers/eventRouter'

const app = express()
app.use(express.json())

app.use('/api/events', eventRouter)

app.get('/ping', (_req, res) => {
  res.send('pong')
})

export default app
