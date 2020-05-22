import convict from 'convict'
import dotenv from 'dotenv'
dotenv.config()

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 4000,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    dev: {
      doc: 'Development DB connection url',
      format: String,
      default: '',
      env: 'MONGODB_URL_DEV',
      arg: 'mongodb-url-dev',
      sensitive: true,
    },
    prod: {
      doc: 'Production DB connection url',
      format: String,
      default: '',
      env: 'MONGODB_URL_PROD',
      arg: 'mongodb-url-prod',
      sensitive: true,
    },
  },
  secret: {
    doc: 'Secret for jwt',
    format: String,
    default: '',
    env: 'SECRET',
    arg: 'secret',
    sensitive: true,
  },
  salt: {
    doc: 'Saltrounds for bcrypt',
    format: 'int',
    default: 10,
    env: 'SALT',
    arg: 'salt',
  },
  passwordMinLength: {
    doc: 'Minimum length for password',
    format: 'int',
    default: 8,
    env: 'PASSWORD_MIN_LENGTH',
    arg: 'password-min-length',
  },
})

export default config
