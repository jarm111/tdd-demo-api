import express from 'express'
import cors from 'cors'
import connectToDb from './utils/dbConnection'
import useLogger from './utils/requestLogger'
import eventRouter from './routers/eventRouter'
import signupRouter from './routers/signupRouter'

const app = express()
app.use(express.json())
app.use(cors())
app.use(useLogger())

connectToDb()

app.use('/api/events', eventRouter)
app.use('/api/signup', signupRouter)

app.get('/', (_, res) => {
  res.send('Welcome to Events Board App API')
})

export default app
