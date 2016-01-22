/* Este arquivo tem todos as funcoes relacionadas diretamente com o Mongo.*/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost/test";


var insertDocument = function(colecao, dados, db, callback) {
  db.collection(colecao).insertMany(dados, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback(result);
  });
};

var getDocuments = function(colecao, filtro, db, callback) {
  var data = [];
  var cursor = db.collection(colecao).find(filtro);
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      data.push(doc);
      console.dir(doc);
    } else {
      callback(data);
    }
  });
};

function end_request(response, data_print) {
  response.writeHead(200, {
    "Content-Type": "text/json"
  });
  response.write(JSON.stringify(data_print));
  response.end();
}

var removeDocuments = function(colecao, dados, db, callback) {
  db.collection('restaurants').deleteMany({
      "name": "Pizzaiolo"
    },
    function(err, results) {
      console.log(results);
      callback();
    }
  );
};

function connectToMongo(response, colecao, dados, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    callback(colecao, dados, db, function() {
      db.close();
      end_request(response, dados);
    });
  });
};

exports.insertDocuments = insertDocument;
exports.getDocuments = getDocuments;
exports.removeDocuments = removeDocuments;
exports.end_request = end_request;
