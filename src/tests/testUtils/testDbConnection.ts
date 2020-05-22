import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import connectionOptions from '../../utils/mongooseConnectionOptions'

export const connect = async (): Promise<MongoMemoryServer> => {
  const mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getConnectionString()
  mongoose.connect(mongoUri, connectionOptions).catch((e) => {
    console.error(e)
  })
  return mongoServer
}

export const closeConnection = async (mongoServer: MongoMemoryServer) => {
  await mongoose.connection.close()
  await mongoServer.stop()
}
