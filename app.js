var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

// HTTPサーバー作成
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).listen(3000);

// 上記サーバーにソケットを紐づける
var io = socketio.listen(server);

// emit: 送信イベント名と送信データを指定
// on: 受信イベント名と受信データを指定

io.sockets.on('connection', function(socket) {
  // クライアント側で送信されたデータを受信 (index.htmlからの流れをみると分かりやすい)
  socket.on('client_to_server', function(data) {
    // 送られてきたデータを送信
    io.sockets.emit('server_to_client', {value : data.value});
  });
});
