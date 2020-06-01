import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Event from '../models/event'
import User from '../models/user'
import config from '../utils/config'

type Payload = {
  id: string
  email: string
}

const eventRouter = Router()

eventRouter.get('/', async (_, res) => {
  const events = await Event.find()
  res.status(200).json(events)
})

eventRouter.post('/', async (req, res, next) => {
  const authHeader = req.get('authorization')
  const { title, date, description, category } = req.body

  try {
    const token = authHeader ? authHeader.substring(7) : ''
    const decodedPayload = jwt.verify(token, config.get('secret')) as Payload

    const user = await User.findById(decodedPayload.id)

    if (!user) {
      const err = new Error(`User provided in token does not exist`)
      err.name = 'AuthenticationError'
      throw err
    }

    const event = new Event({
      title,
      description,
      date,
      category,
    })

    const savedEvent = await event.save()
    res.status(201).json(savedEvent)
  } catch (e) {
    next(e)
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

eventRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const { title, description, date, category } = req.body

  const updatedEvent = {
    title,
    description,
    date,
    category,
  }

  try {
    const result = await Event.findByIdAndUpdate(id, updatedEvent, {
      new: true,
      runValidators: true,
    })
    if (!result) {
      throw new Error('Document not found')
    }
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

export default eventRouter
