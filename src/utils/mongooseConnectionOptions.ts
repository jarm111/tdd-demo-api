import mongoose from 'mongoose'

export default {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
} as mongoose.ConnectionOptions
