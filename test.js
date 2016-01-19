var http = require('http');
var server = http.createServer();

server.on('request',function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World \n');
  res.end()
})

server.listen(3000);
console.log('Server running on localhost 3000');
