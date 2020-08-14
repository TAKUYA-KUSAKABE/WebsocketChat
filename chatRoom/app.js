var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).listen(3000);


var io = socketio.listen(server);


io.sockets.on('connection', function(socket) {
  var room = '';
  var name = '';

  // roomへの入室は、「socket.join(room名)」
  socket.on('client_to_server_join', function(data) {
    room = data.value;
    socket.join(room);
  });

  socket.on('client_to_server', function(data) {
    io.to(room).emit('server_to_client', {value : data.value});
  });


  socket.on('client_to_server_broadcast', function(data) {
    // .toでroomを指定
    socket.broadcast.to(room).emit('server_to_client', {value : data.value});
  });

  socket.on('client_to_server_personal', function(data) {
    var id = socket.id;
    name = data.value;
    var personalMessage = "あなたは、" + name + "さんとして入室しました。"
    io.to(id).emit('server_to_client', {value : personalMessage});
  });

  socket.on('disconnect', function() {
    if (name === '') {
      console.warn("未入室のまま、どこかへ去っていきました。");
    } else {
      var endMessage = name + "さんが退出しました。"
      io.to(room).emit('server_to_client', {value : endMessage});
    }
  });
});
