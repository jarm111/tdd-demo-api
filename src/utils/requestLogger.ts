import morgan from 'morgan'
import config from './config'

const useLogger = () => {
  if (config.get('env') === 'test') {
    return morgan(() => null)
  }

  morgan.token('body', (req) => JSON.stringify(req.body))
  return morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
}

export default useLogger
