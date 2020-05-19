import { Router } from 'express'
import Event from '../models/event'

const eventRouter = Router()

eventRouter.get('/', async (_, res) => {
  const events = await Event.find()
  res.status(200).json(events)
})

export default eventRouter
