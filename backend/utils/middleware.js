const logger = require('./logger')

const requestLogger = (req, _res, next) => {
  logger.info('-- request logger --')
  logger.info('Method:', req.method)
  logger.info('Path', req.path)
  logger.info('Body:', req.body)
  logger.info('--------------------\n')
  next()
}

// 404 handler
const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// error handler
const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}