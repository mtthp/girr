const express = require('express')
const router = express.Router()
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')
const package = require('../package.json');

// check here for documentation https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'GeekInc Remote Regie API',
    version: package.version,
    description: 'This is the GIRR (aka GeekInc Remote Regie) app API. You can find out more about GIRR at [https://github.com/chriscamicas/girr](https://github.com/chriscamicas/girr) or on [geekinc.fr](http://geekinc.fr).'
  },
  // host: 'localhost:' + port, // TO DO - define it dynamically
  basePath: '/api'
}

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [path.resolve('src/*/*.js')]
}

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

// serve swagger
router.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

router.get('/', function (req, res) {
  res.sendFile(path.resolve('public/swagger/index.html'))
  router.use('/', express.static('public/swagger'))
})

module.exports = router

