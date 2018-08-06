//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// remove console logs from the server
const winston = require('winston')
let logger = require('../src/logger')
logger.remove(winston.transports.Console)