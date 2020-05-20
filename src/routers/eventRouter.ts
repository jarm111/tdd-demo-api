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

eventRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    await Event.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

export default eventRouter
