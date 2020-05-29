import bcrypt from 'bcrypt'
import TestDbConnection from './testUtils/TestDbConnection'
import req from 'supertest'
import app from '../app'
import User from '../models/user'
import users from './testData/user.testData'
import config from '../utils/config'

const dbConnection = new TestDbConnection()

const getUsersInDb = async () => {
  return await User.find({})
}

const initUsers = async () => {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(
        user.password,
        config.get('salt')
      )
      return {
        email: user.email,
        passwordHash: hashedPassword,
      }
    })
  )
  return hashedUsers
}

beforeAll(async () => {
  await dbConnection.connect()
})

afterAll(async () => {
  await dbConnection.disconnect()
})

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(await initUsers())
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
