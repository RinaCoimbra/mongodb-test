var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGOLAB_URI || "mongodb://localhost/test";


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
  "name": "Vella",
  "restaurant_id": "41704620"
};

var harry = {
  "Nome": "Harry Potter",
  "Casa": "Grifinória",
  "Mae": "Lilian Potter",
  "Pai": "James Potter"
}

var insertDocument = function(db, callback) {
  db.collection('restaurants').insertOne( restaurant_1, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the AlunoHogwarts collection.");
    callback(result);
  });
};

var findRestaurants = function(db, callback) {
  var data = [];
  var cursor = db.collection('restaurants').find();
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      data.append(doc);
      console.dir(doc);
    } else {
      callback(data);
    }
  });
};

function insertDocumentIntoMongo() {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
      db.close();
    });
  });
};


function getDocumentsFromMongo(response) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function(data) {
      db.close();
      response.writeHead(200, {
        "Content-Type": "text/json"
      });
      response.write(JSON.stringify(data));
      response.end();
    });
  });
}

exports.insertDocumentIntoMongo = insertDocumentIntoMongo;
exports.getDocumentsFromMongo = getDocumentsFromMongo;
