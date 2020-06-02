import TestDbConnection from './testUtils/TestDbConnection'
import req from 'supertest'
import app from '../app'
import User from '../models/user'
import users from './testData/user.testData'
import hashPasswords from './testUtils/hashPasswords'

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
  await User.insertMany(await hashPasswords(users))
})

test('successful login', async () => {
  const usersInDb = await getUsersInDb()
  const [user] = users
  const [userInDb] = usersInDb

  const res = await req(app)
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(res.body.id).toEqual(userInDb._id.toString())
  expect(res.body.token).toBeDefined()
})

test('no user with given email', async () => {
  const user = {
    email: 'no.such@email.com',
    password: 'foobar123',
  }

  await req(app)
    .post('/api/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('wrong password', async () => {
  const [{ email }] = users

  const user = {
    email: email,
    password: 'foobar123',
  }

  await req(app)
    .post('/api/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})
