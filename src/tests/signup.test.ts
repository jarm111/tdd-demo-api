import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, closeConnection } from './testUtils/testDbConnection'
import req from 'supertest'
import app from '../app'
import User from '../models/user'
import { newUser } from './testData/user.testData'

let mongoServer: MongoMemoryServer

const getUsersInDb = async () => {
  return await User.find({})
}

beforeAll(async () => {
  mongoServer = await connect()
})

afterAll(async () => {
  await closeConnection(mongoServer)
})

beforeEach(async () => {
  await User.deleteMany({})
})

test('successful sign up', async () => {
  const res = await req(app)
    .post('/api/signup')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersInDb = await getUsersInDb()
  const emails = usersInDb.map((user) => user.email)

  expect(emails).toContain(newUser.email)
  expect(res.body.email).toBe(newUser.email)
  expect(res.body.token).toBeDefined()
})

test('email validation', async () => {
  const contentWithBadEmail = {
    email: 'incorrect.mail.com',
    password: newUser.password,
  }

  await req(app).post('/api/signup').send(contentWithBadEmail).expect(400)

  const usersInDb = await getUsersInDb()
  const emails = usersInDb.map((user) => user.email)

  expect(emails).not.toContain(newUser.email)
})

test('password validation', async () => {
  const contentWithBadPassword = { email: newUser.email, password: 'short' }

  await req(app).post('/api/signup').send(contentWithBadPassword).expect(400)
})