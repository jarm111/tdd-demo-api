import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import req from 'supertest'
import app from '../app'
import Event from '../models/event'
import events, { newEvent, EventType } from './testData/eventsData'

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

test('get initial events', async () => {
  const res = await req(app)
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(events.length)
})

test('create new event', async () => {
  await req(app)
    .post('/api/events')
    .send(newEvent)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const eventsInDb: unknown = await getEventsInDb()
  const titles = (eventsInDb as EventType[]).map((event) => event.title)

  expect((eventsInDb as EventType[]).length).toBe(events.length + 1)
  expect(titles).toContain(newEvent.title)
})

test('handle invalid event creation', async () => {
  const { title, description } = newEvent
  const invalidEvent = { title, description }

  await req(app).post('/api/events').send(invalidEvent).expect(400)

  const eventsInDb = await getEventsInDb()

  expect(eventsInDb.length).toBe(events.length)
})
