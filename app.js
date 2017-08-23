const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const config = require("./config/server");
const WebSockets = require("./websockets");

mongoose.Promise = Promise;

const websockets = new WebSockets(io);
// monter les routes
const emission = require('./routes/emission.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
.use(bodyParser.json())
// Indique que le dossier /public contient des fichiers statiques
// (middleware chargé de base)
.use(express.static('./public'))
.use('/api/emissions', emission)
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
