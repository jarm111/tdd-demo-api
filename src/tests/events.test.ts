import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import req from 'supertest'
import app from '../app'
import Event from '../models/event'
import events, { newEvent } from './testData/eventsData'

let mongoServer: MongoMemoryServer

const getEventsInDb = async () => {
  return await Event.find({})
}

beforeAll(async () => {
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getConnectionString()
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((e) => {
      console.error(e)
    })
})

beforeEach(async () => {
  await Event.deleteMany({})
  await Event.insertMany(events)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})

test('get events', async () => {
  const res = await req(app)
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(events.length)
})

test('create event', async () => {
  await req(app)
    .post('/api/events')
    .send(newEvent)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const eventsInDb = await getEventsInDb()
  const titles = eventsInDb.map((event) => event.title)

  expect(eventsInDb.length).toBe(events.length + 1)
  expect(titles).toContain(newEvent.title)
})

test('create invalid event', async () => {
  const { title, description } = newEvent
  const invalidEvent = { title, description }

  await req(app).post('/api/events').send(invalidEvent).expect(400)

  const eventsInDb = await getEventsInDb()

  expect(eventsInDb.length).toBe(events.length)
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
