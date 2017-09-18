"use strict"; // https://stackoverflow.com/a/33001437
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const basicAuth = require('express-basic-auth');
const config = require("./config/server");
const WebSockets = require("./src/websockets");
const logger = require("./src/logger");
const path = require('path')

mongoose.Promise = Promise;

const websockets = new WebSockets(io);

let password = process.env.GIRR_PASSWORD || config.password;
if(password) {
  app.use(basicAuth({
    users: { girr: password },
    challenge: true,
    realm: 'g1RR'
  }));
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
.use(bodyParser.json())
// middleware to use for all requests
.use(function (req, res, next) {
  // do logging
  logger.log('info',
    '[%s] >> %s %s %s',
    req.connection.remoteAddress,
    req.method,
    req.url,
    Object.keys(req.body).length ? JSON.stringify(req.body) : ''
  )
  next() // make sure we go to the next routes and don't stop here
})
// Indique que le dossier /public contient des fichiers statiques
// (middleware chargé de base)
.use(express.static('./public'))
 // swagger.json
.use('/', require('./src/swagger'))
 // swagger UI
.get('/api', function (req, res) {
  res.sendFile(path.resolve('public/swagger/index.html'))
  app.use('/', express.static('public/swagger'))
})
.use('/api/programs', require('./src/routes/program.js'))
// error middleware
.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status ? err.status : 500).send(err);
});


mongoose.connect(config.mongo_endpoint, { useMongoClient: true })
mongoose.connection.on('open', () => {
  io.listen(app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}/admin.html`);
    console.log(`http://localhost:${config.port}/xsplit.html`);
  }));
});
