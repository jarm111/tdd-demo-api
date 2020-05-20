import convict from 'convict'
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
})

export default config
