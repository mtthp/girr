var winston = require('winston')
var path = require('path')
const fs = require('fs')
winston.emitErrs = true

let logsPath = process.env.LOGS_PATH
if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath)

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: path.resolve(process.env.LOGS_PATH + '/info.log'),
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
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
            json: false,
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
