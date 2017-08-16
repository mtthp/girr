const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const config = require("./config/server");

mongoose.Promise = Promise;

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
  if(err) return res.status(500).send({ error: err });
  next();
});

const CONNECTION = "connection",
SET_TITLE = "setTitle",
SET_INCRUST = "setIncrust",
CLEAR_INCRUST = "clearIncrust",
DEFAULT_TITLE = "GeekInc Remote Regie ready !";

io.on(CONNECTION, socket => {

  const config = {
    text: DEFAULT_TITLE,
    timeout: 2
  };

  socket.emit(SET_TITLE, config);

  socket.on(SET_TITLE, data => {
    console.log(data);
    config = data; //TODO merge config & data
    io.sockets.emit(SET_TITLE, data);
  });

  socket.on(SET_INCRUST, data => {
    console.log(data);
    //TODO check the file exists in the directory
    io.sockets.emit(SET_INCRUST, data);
  });

  socket.on(CLEAR_INCRUST, data => {
    console.log(data);
    io.sockets.emit(CLEAR_INCRUST, data);
  });

});


mongoose.connect(config.mongo_endpoint, { useMongoClient: true })
mongoose.connection.on('open', () => {
  io.listen(app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}/admin.html`);
    console.log(`http://localhost:${config.port}/xsplit.html`);
  }));
});
