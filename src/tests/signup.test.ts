import TestDbConnection from './testUtils/TestDbConnection'
import req from 'supertest'
import app from '../app'
import User from '../models/user'
import { newUser } from './testData/user.testData'

const dbConnection = new TestDbConnection()

const getUsersInDb = async () => {
  return await User.find({})
}

beforeAll(async () => {
  await dbConnection.connect()
})

afterAll(async () => {
  await dbConnection.disconnect()
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

test('email format validation', async () => {
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
