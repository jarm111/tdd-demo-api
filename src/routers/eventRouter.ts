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

const checkEventOwnership = (user: UserProps, id: string) => {
  if (!(user.ownEvents && user.ownEvents.toString().includes(id))) {
    const err = new Error(
      `User has no rights to modify event or event with given id does not exist`
    )
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
    })

    const savedEvent = await event.save()
    user.ownEvents = user.ownEvents?.concat(savedEvent.id)
    await user.save()
    res.status(201).json(savedEvent)
  } catch (e) {
    next(e)
  }
})

eventRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const user = await authenticateUser(req)

    checkEventOwnership(user, id)

    await Event.findByIdAndDelete(id)

    user.ownEvents = user.ownEvents?.filter(
      (eventId) => eventId.toString() !== id
    )
    await user.save()

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
    const user = await authenticateUser(req)

    checkEventOwnership(user, id)

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
