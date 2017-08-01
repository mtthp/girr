const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose')

// monter les routes
const emission = require('./routes/emission.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('./public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use('/api/emissions', emission);

io.on('connection', socket => {

  socket.emit('setTitle', { text: 'GeekInc Remote Regie ready !' });

  socket.on('setTitle', data => {
    console.log(data);
    io.sockets.emit('setTitle', data);
  });

  socket.on('setIncrust', data => {
    //todo check the file exists in the directory
    io.sockets.emit('setIncrust', data);
  });

  socket.on('clearIncrust', data => {
    io.sockets.emit('clearIncrust', data);
  });

});


mongoose.connect('mongodb://localhost/girr', { useMongoClient: true })
mongoose.connection.on('open', () => {
  let port = 8081;
  io.listen(app.listen(port, () => {
    console.log(`http://localhost:${port}/admin.html`);
    console.log(`http://localhost:${port}/xsplit.html`);
  }));
});