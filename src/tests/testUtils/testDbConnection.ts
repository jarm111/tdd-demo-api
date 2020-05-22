import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import connectionOptions from '../../utils/mongooseConnectionOptions'

export default class TestDbConnection {
  connection: MongoMemoryServer | null
  constructor() {
    this.connection = null
  }

  async connect() {
    this.connection = new MongoMemoryServer()
    const mongoUri = await this.connection.getConnectionString()
    mongoose.connect(mongoUri, connectionOptions).catch((e) => {
      console.error(e)
    })
  }

  async disconnect() {
    await mongoose.connection.close()
    this.connection && (await this.connection.stop())
  }
}
