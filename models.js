var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://heroku_3h7dws7z:cbedvslhinh4b2c3okque48l5l@ds047355.mongolab.com:47355/heroku_3h7dws7z";



var insertDocument = function(db, callback) {
  db.collection('AlunoHogwarts').insertOne({
    "Nome": "Harry Potter",
    "Casa": "Grifinória",
    "Mae": "Lilian Potter",
    "Pai": "James Potter",
  }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the AlunoHogwarts collection.");
    callback(result);
  });
};

var findRestaurants = function(db, callback) {
  var cursor = db.collection('restaurants').find();
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      console.dir(doc);
    } else {
      callback();
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

exports.insertDocumentIntoMongo = insertDocumentIntoMongo;
