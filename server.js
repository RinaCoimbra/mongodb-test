var http = require("http");
var url = require("url");

var port = process.env.PORT || 5000;

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    if (request.method == 'POST') {
      var jsonString = '';

      request.on('data', function(data) {
        jsonString += data;
      });

      request.on('end', function() {
        if (jsonString){
          request.body = JSON.parse(jsonString);
        }
        else{
          request.body = {};
        }
        route(handle, pathname, response, request);
      });
    } else {
      route(handle, pathname, response, request);
    }

  }

  http.createServer(onRequest).listen(port);
  console.log("Server has started.");
}

exports.start = start;
