var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).listen(3000);


var io = socketio.listen(server);

// S04. connectionイベント・データを受信する
io.sockets.on('connection', function(socket) {
  var name;

  // ここはchat/app.jsと同じ
  socket.on('client_to_server', function(data) {
    io.sockets.emit('server_to_client', {value : data.value});
  });

  socket.on('client_to_server_broadcast', function(data) {
    // broadcast.emitで自分以外に送信
    socket.broadcast.emit('server_to_client', {value : data.value});
  });

  // socket.idを指定してメッセージを送る
  socket.on('client_to_server_personal', function(data) {
    console.warn(socket.id)
    var id = socket.id;
    name = data.value;
    var personalMessage = "あなたは、" + name + "さんとして入室しました。"
    io.to(id).emit('server_to_client', {value : personalMessage});
  });

  // 接続が切れたときの処理
  socket.on('disconnect', function() {
    if (name === 'undefined') {
      console.log("未入室のまま、どこかへ去っていきました。");
    } else {
      var endMessage = name + "さんが退出しました。"
      io.sockets.emit('server_to_client', {value : endMessage});
    }
  });
});
