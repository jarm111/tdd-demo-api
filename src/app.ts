import express from 'express'
import eventRouter from './routers/eventRouter'
import connectToDb from './utils/dbConnection'

const app = express()
app.use(express.json())

connectToDb()

app.use('/api/events', eventRouter)

app.get('/ping', (_req, res) => {
  res.send('pong')
})

export default app
