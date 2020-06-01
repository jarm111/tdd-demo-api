import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const respond = (status: number): void => {
    res.status(status).json({
      error: err.message,
    })
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return respond(400)
  }

  if (err.name === 'AuthenticationError' || err.name === 'JsonWebTokenError') {
    return respond(401)
  }

  if (err.message === 'Document not found') {
    return respond(404)
  }

  return next()
}

export default errorHandler
