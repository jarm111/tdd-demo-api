import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import req from 'supertest'
import app from '../app'
import Event from '../models/event'
import events from './testData/eventsData'

let mongoServer: MongoMemoryServer

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

test('gets initial events', async () => {
  const res = await req(app)
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(events.length)
})
