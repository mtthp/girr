const winston = require('winston')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')

process.env.LOGS_PATH = process.env.LOGS_PATH.startsWith('/') ? process.env.LOGS_PATH : path.join(__base, process.env.LOGS_PATH)
if (!fs.existsSync(process.env.LOGS_PATH)) utils.mkdirSyncRecursive(process.env.LOGS_PATH)

winston.emitErrs = true
const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: path.resolve(process.env.LOGS_PATH + '/info.log'),
            handleExceptions: false,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            name: 'debug-file',
            level: 'debug',
            filename: path.resolve(process.env.LOGS_PATH + '/debug.log'),
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
            name: 'error-file',
            level: 'error',
            filename: path.resolve(process.env.LOGS_PATH + '/error.log'),
            handleExceptions: true,
            json: true,
            colorize: false
        }),
    ],
    exitOnError: false
})

module.exports = logger
// module.exports.stream = {
//     write: function(message, encoding){
//         logger.info(message);
//     }
// }
