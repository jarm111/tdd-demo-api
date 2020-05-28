import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const message = {
    error: err.message,
  }

  const respond = (status: number): void => {
    res.status(status).send(message)
  }

  if (err.name === 'ValidationError') {
    return respond(400)
  }

  if (err.name === 'CastError') {
    return respond(400)
  }

  if (err.message === 'Document not found') {
    return respond(404)
  }

  return next()
}

export default errorHandler
