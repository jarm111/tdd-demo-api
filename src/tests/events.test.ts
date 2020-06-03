import TestDbConnection from './testUtils/TestDbConnection'
import req from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import Event from '../models/event'
import User, { UserProps } from '../models/user'
import events, { newEvent } from './testData/event.testData'
import users from './testData/user.testData'
import config from '../utils/config'
import hashPasswords from './testUtils/hashPasswords'

const dbConnection = new TestDbConnection()

const getEventsInDb = async () => {
  return await Event.find({})
}

const getUsersInDb = async () => {
  return await User.find({})
}

const createToken = (user: UserProps) => {
  const payload = {
    id: user._id,
    email: user.email,
  }
  return jwt.sign(payload, config.get('secret'))
}

beforeAll(async () => {
  await dbConnection.connect()
})

afterAll(async () => {
  await dbConnection.disconnect()
})

beforeEach(async () => {
  await Event.deleteMany({})
  await User.deleteMany({})
  await Event.insertMany(events)
  await User.insertMany(await hashPasswords(users))
  const eventsInDb = await getEventsInDb()
  const [user] = await getUsersInDb()
  const eventIds = eventsInDb.map((event) => event.id)
  user.ownEvents = user.ownEvents?.concat(eventIds)
  await user.save()
})

test('get events', async () => {
  const res = await req(app)
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(events.length)
})

test('create event', async () => {
  const [userInDb] = await getUsersInDb()
  const token = createToken(userInDb)
  const res = await req(app)
    .post('/api/events')
    .set({ Authorization: `bearer ${token}` })
    .send(newEvent)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const [userInDbAfter] = await getUsersInDb()
  const eventsInDbAfter = await getEventsInDb()
  const titles = eventsInDbAfter.map((event) => event.title)

  expect(eventsInDbAfter.length).toBe(events.length + 1)
  expect(titles).toContain(newEvent.title)
  expect(userInDbAfter.ownEvents?.toString()).toContain(res.body._id)
})

test('create event validation', async () => {
  const [userInDb] = await getUsersInDb()
  const token = createToken(userInDb)
  const { title, description } = newEvent
  const invalidEvent = { title, description }

  await req(app)
    .post('/api/events')
    .set({ Authorization: `bearer ${token}` })
    .send(invalidEvent)
    .expect(400)

  const eventsInDb = await getEventsInDb()

  expect(eventsInDb.length).toBe(events.length)
})

test('missing token on create event', async () => {
  await req(app)
    .post('/api/events')
    .send(newEvent)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('unauthorized create event', async () => {
  const badToken = 'badToken'
  await req(app)
    .post('/api/events')
    .set({ Authorization: `bearer ${badToken}` })
    .send(newEvent)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('delete event', async () => {
  const [userInDb] = await getUsersInDb()
  const token = createToken(userInDb)
  const [eventToDelete] = await getEventsInDb()

  await req(app)
    .delete(`/api/events/${eventToDelete._id}`)
    .set({ Authorization: `bearer ${token}` })
    .expect(204)

  const eventsInDbAfter = await getEventsInDb()
  const titles = eventsInDbAfter.map((event) => event.title)
  const [userInDbAfter] = await getUsersInDb()

  expect(eventsInDbAfter.length).toBe(events.length - 1)
  expect(titles).not.toContain(eventToDelete.title)
  expect(userInDbAfter.ownEvents?.toString()).not.toContain(eventToDelete.id)
})

test('unauthorized delete event', async () => {
  const [, userInDbWithNoRights] = await getUsersInDb()
  const token = createToken(userInDbWithNoRights)
  const eventsInDb = await getEventsInDb()
  const [eventToDelete] = eventsInDb

  await req(app)
    .delete(`/api/events/${eventToDelete._id}`)
    .set({ Authorization: `bearer ${token}` })
    .expect(401)
})

test('update event', async () => {
  const [userInDb] = await getUsersInDb()
  const token = createToken(userInDb)
  const eventsInDb = await getEventsInDb()
  const [{ title, date, category, _id }] = eventsInDb
  const updatedDescription = 'Test to update description'

  const updatedEvent = {
    title,
    date,
    description: updatedDescription,
    category,
  }

  await req(app)
    .put(`/api/events/${_id}`)
    .set({ Authorization: `bearer ${token}` })
    .send(updatedEvent)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const eventsInDbAfter = await getEventsInDb()
  const descriptions = eventsInDbAfter.map((event) => event.description)

  expect(descriptions).toContain(updatedDescription)
})

test('unauthorized update event', async () => {
  const [, userInDbWithNoRights] = await getUsersInDb()
  const token = createToken(userInDbWithNoRights)
  const eventsInDb = await getEventsInDb()
  const [{ title, date, category, _id }] = eventsInDb
  const updatedDescription = 'Test to update description'

  const updatedEvent = {
    title,
    date,
    description: updatedDescription,
    category,
  }

  await req(app)
    .put(`/api/events/${_id}`)
    .set({ Authorization: `bearer ${token}` })
    .send(updatedEvent)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('update missing event', async () => {
  const [userInDb] = await getUsersInDb()
  const token = createToken(userInDb)
  const eventsInDb = await getEventsInDb()
  const [event] = eventsInDb

  await Event.deleteMany({})

  await req(app)
    .put(`/api/events/${event._id}`)
    .set({ Authorization: `bearer ${token}` })
    .send(event)
    .expect(404)
    .expect('Content-Type', /application\/json/)
})
