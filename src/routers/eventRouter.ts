import { Router, Request } from 'express'
import jwt from 'jsonwebtoken'
import Event from '../models/event'
import User, { UserProps } from '../models/user'
import config from '../utils/config'

const eventRouter = Router()

const authenticateUser = async (req: Request) => {
  type Payload = {
    id: string
    email: string
  }

  const authHeader = req.get('authorization')
  const token = authHeader ? authHeader.substring(7) : ''
  const decodedPayload = jwt.verify(token, config.get('secret')) as Payload

  const user = await User.findById(decodedPayload.id)

  if (!user) {
    const err = new Error(`User provided in token does not exist`)
    err.name = 'AuthenticationError'
    throw err
  }

  return user
}

const checkEventOwnership = async (user: UserProps, id: string) => {
  const event = await Event.findById(id)

  if (!event) {
    throw new Error('Document not found')
  }

  if (!(event.user && event.user.toString() === user._id.toString())) {
    const err = new Error(`User has no rights to modify event`)
    err.name = 'AuthenticationError'
    throw err
  }
}

eventRouter.get('/', async (_, res) => {
  const events = await Event.find()
  res.status(200).json(events)
})

eventRouter.post('/', async (req, res, next) => {
  const { title, date, description, category } = req.body

  try {
    const user = await authenticateUser(req)

    const event = new Event({
      title,
      description,
      date,
      category,
      user: user.id,
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
    const user = await authenticateUser(req)

    await checkEventOwnership(user, id)

    await Event.findByIdAndDelete(id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

eventRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const { title, description, date, category } = req.body

  try {
    const user = await authenticateUser(req)

    await checkEventOwnership(user, id)

    const updatedEvent = {
      title,
      description,
      date,
      category,
      user: user.id,
    }

    const result = await Event.findByIdAndUpdate(id, updatedEvent, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

export default eventRouter
