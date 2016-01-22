var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/initialPokemon"] = requestHandlers.initialPokemon;
handle["/myLeagueData"] = requestHandlers.myLeagueData;
handle["/pagepage"] = requestHandlers.pagepage;
handle["/insertDocument"] = requestHandlers.insertIntoDatabase;
handle["/getDocumentsFromMongo"] = requestHandlers.getFromMongo;
handle["/removeFromMongo"] = requestHandlers.removeFromMongo;
handle["/printjson"] = requestHandlers.printJson;
handle["/inserejson"] = requestHandlers.insereJson;
handle["/buscafiltro"] = requestHandlers.buscafiltro;

server.start(router.route, handle);
