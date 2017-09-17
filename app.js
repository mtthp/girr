"use strict"; // https://stackoverflow.com/a/33001437
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const basicAuth = require('express-basic-auth');
const config = require("./config/server");
const WebSockets = require("./websockets");
const path = require('path')

mongoose.Promise = Promise;

const websockets = new WebSockets(io);
// monter les routes
const emission = require('./routes/emission.js');


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
// Indique que le dossier /public contient des fichiers statiques
// (middleware chargé de base)
.use(express.static('./public'))
.use('/api/emissions', emission)
 // swagger.json
.use('/', require('./swagger'))
 // swagger UI
.get('/api', function (req, res) {
  res.sendFile(path.resolve('public/swagger/index.html'))
  app.use('/', express.static('public/swagger'))
})
.use((err, req, res, next) => {
  if(err) {
    console.error(`\n==== ERROR: ${(new Date).toLocaleString()} ====`);
    console.error(err);
    console.error("=================\n");

    return res.status(500).send({ error: err });
  }

  next();
});


mongoose.connect(config.mongo_endpoint, { useMongoClient: true })
mongoose.connection.on('open', () => {
  io.listen(app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}/admin.html`);
    console.log(`http://localhost:${config.port}/xsplit.html`);
  }));
});
