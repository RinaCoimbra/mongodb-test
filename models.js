var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost/test";

var restaurant_1 = {
  "address": {
    "street": "2 Avenue",
    "zipcode": "10075",
    "building": "1480",
    "coord": [-73.9557413, 40.7720266]
  },
  "borough": "Manhattan",
  "cuisine": "Italian",
  "grades": [{
    "date": new Date("2014-10-01T00:00:00Z"),
    "grade": "A",
    "score": 11
  }, {
    "date": new Date("2014-01-16T00:00:00Z"),
    "grade": "B",
    "score": 17
  }],
  "name": "Pizzaiolo",
  "restaurant_id": "41704620"
};

var harry = {
  "Nome": "Harry Potter",
  "Casa": "Grifinória",
  "Mae": "Lilian Potter",
  "Pai": "James Potter"
}

var hermione = {
  "Nome": "Hermione"
}

var alunosHogwarts = [harry, hermione];

var insertDocument = function(colecao, dados, db, callback) {
  db.collection(colecao).insertOne(hermione, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback(result);
  });
};

var findRestaurants = function(filtro, colecao, db, callback) {
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

function insertDocumentIntoMongo(response, colecao, dados) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(colecao, dados, db, function() {
      db.close();
      end_request(response, dados);
    });
  });
};

function end_request(response, data_print) {
  response.writeHead(200, {
    "Content-Type": "text/json"
  });
  response.write(JSON.stringify(data_print));
  response.end();
}

function getDocumentsFromMongo(response, filtro, colecao) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(filtro, colecao, db, function(data) {
      db.close();
      end_request(response, data)
    });
  });
};

var removeRestaurants = function(db, callback) {
  db.collection('restaurants').deleteMany({
      "name": "Pizzaiolo"
    },
    function(err, results) {
      console.log(results);
      callback();
    }
  );
};

var removeFromMongo = function(response) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    removeRestaurants(db, function() {
      db.close();
      end_request(response, {});
    });
  });
};

exports.insertDocumentIntoMongo = insertDocumentIntoMongo;
exports.getDocumentsFromMongo = getDocumentsFromMongo;
exports.removeFromMongo = removeFromMongo;
exports.end_request = end_request;
