import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const message = {
    error: err.message,
  }

  if (err.name === 'ValidationError') {
    return res.status(400).send(message)
  }

  if (err.name === 'CastError') {
    return res.status(400).send(message)
  }

  if (err.message === 'Document not found') {
    return res.status(404).send(message)
  }

  return next()
}

export default errorHandler
