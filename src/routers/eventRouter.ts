import { Router } from 'express'
import Event from '../models/event'

const eventRouter = Router()

eventRouter.get('/', async (_, res) => {
  const events = await Event.find()
  res.status(200).json(events)
})

eventRouter.post('/', async (req, res) => {
  const { title, date, description, category } = req.body

  try {
    const event = new Event({
      title,
      description,
      date,
      category,
    })

    const savedEvent = await event.save()
    res.status(201).json(savedEvent)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

export default eventRouter
