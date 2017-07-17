var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('./public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
  .use(function (req, res) { // Répond enfin
    res.send('Hello');
  });

io.on('connection', socket => {

  socket.emit('setTitle', { text: 'Title ready !', timeout: 5 });

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

let port = 8081;
io.listen(app.listen(port, () => {
  console.log(`http://localhost:${port}/admin.html`);
  console.log(`http://localhost:${port}/xsplit.html`);
}));
