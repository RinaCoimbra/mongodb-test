var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
var http = require("https");
var models = require("./models");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}

function initialPokemon(response) {
  var pkm = ["Charmander", "Squirtle", "Bulbasaur"];
  var digimon = {"nome": "agumon", "evolucoes": ["greymon", "wargreymon"]};
  response.writeHead(200, {"Content-Type": "text/json"});
  response.write(JSON.stringify(digimon));
  response.end();
}

function getUrl(url, response2, callback){
  var request = http.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event
    var buffer = "",
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    });

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        callback(data, response2);
    });
});
}

function returnLeagueData(data, response){
  response.writeHead(200, {"Content-Type": "text/json"});
  response.write(JSON.stringify(data));
  response.end();
}

function myLeagueData(response, request){
  console.log(request.body);
  var invocador = request.body.invocador;
  var url = "https://na.api.pvp.net/api/lol/br/v1.4/summoner/by-name/"+invocador+"?api_key=7c20378c-001e-4639-ab96-669be9f17f7f";
  getUrl(url, response, returnLeagueData);
}

function pagepage(response){
  fs.readFile('helloworld.html',function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
    });
}

function insertIntoDatabase(response, request){
  models.insertDocumentIntoMongo();
  response.writeHead(200);
  response.end();
}

function getFromMongo(response, request){
  models.getDocumentsFromMongo(response);
}

function removeFromMongo(response){
  models.removeFromMongo(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.initialPokemon = initialPokemon;
exports.myLeagueData = myLeagueData;
exports.pagepage = pagepage;
exports.insertIntoDatabase = insertIntoDatabase;
exports.getFromMongo = getFromMongo;
exports.removeFromMongo = removeFromMongo;