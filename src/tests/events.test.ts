import TestDbConnection from './testUtils/TestDbConnection'
import req from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import Event from '../models/event'
import User from '../models/user'
import events, { newEvent } from './testData/event.testData'
import { newUser } from './testData/user.testData'
import config from '../utils/config'

const dbConnection = new TestDbConnection()

const getEventsInDb = async () => {
  return await Event.find({})
}

const createToken = async () => {
  const user = await User.findOne({ email: newUser.email })
  const payload = {
    id: user?._id,
    email: user?.email,
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
  await User.insertMany({ email: newUser.email, passwordHash: 'hash' })
})

test('get events', async () => {
  const res = await req(app)
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(events.length)
})

test('create event', async () => {
  const token = await createToken()
  await req(app)
    .post('/api/events')
    .set({ Authorization: `bearer ${token}` })
    .send(newEvent)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const eventsInDb = await getEventsInDb()
  const titles = eventsInDb.map((event) => event.title)

  expect(eventsInDb.length).toBe(events.length + 1)
  expect(titles).toContain(newEvent.title)
})

test('handle event validation', async () => {
  const token = await createToken()
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

test('handle missing token on create event', async () => {
  await req(app)
    .post('/api/events')
    .send(newEvent)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('handle unauthorized create event', async () => {
  const badToken = 'badToken'
  await req(app)
    .post('/api/events')
    .set({ Authorization: `bearer ${badToken}` })
    .send(newEvent)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('delete event', async () => {
  const eventsInDb = await getEventsInDb()
  const [eventToDelete] = eventsInDb

  await req(app).delete(`/api/events/${eventToDelete._id}`).expect(204)

  const eventsInDbAfter = await getEventsInDb()
  const titles = eventsInDbAfter.map((event) => event.title)

  expect(eventsInDbAfter.length).toBe(events.length - 1)
  expect(titles).not.toContain(eventToDelete.title)
})

test('update event', async () => {
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
    .send(updatedEvent)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const eventsInDbAfter = await getEventsInDb()
  const descriptions = eventsInDbAfter.map((event) => event.description)

  expect(descriptions).toContain(updatedDescription)
})

test('handle event not found', async () => {
  const eventsInDb = await getEventsInDb()
  const [event] = eventsInDb

  await Event.deleteMany({})

  await req(app)
    .put(`/api/events/${event._id}`)
    .send(event)
    .expect(404)
    .expect('Content-Type', /application\/json/)
})

test('handle malformed id', async () => {
  const eventsInDb = await getEventsInDb()
  const [event] = eventsInDb
  const badId = 'This is bad id'

  await req(app)
    .put(`/api/events/${badId}`)
    .send(event)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})
