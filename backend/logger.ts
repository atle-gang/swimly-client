import pino from 'pino'
import 'dotenv/config'

const isProduction = process.env.NODE_ENV === 'production'

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password', 'secret', 'token', 'authorization', 'cookie'],

  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
})

export default logger;