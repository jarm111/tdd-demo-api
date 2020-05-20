import mongoose from 'mongoose'
import config from './config'

const connectToDb = () => {
  if (config.get('env') === 'test') {
    return
  }

  const dbUrl =
    config.get('env') === 'production'
      ? config.get('db.prod')
      : config.get('db.dev')

  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`connected to ${config.get('env')} DB`)
    })
    .catch((error) => {
      console.error('DB connection error', error.message)
    })
}

export default connectToDb
