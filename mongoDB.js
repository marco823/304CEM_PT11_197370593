/* mongoDB.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
//Clean up DB data
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
	    dbo.collection("category").deleteMany({}, function(err, obj) {
	        if (err) throw err;
	        console.log("Data Removed");
	        db.close();
	    });
	});
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
	    dbo.collection("favicate").deleteMany({}, function(err, obj) {
	        if (err) throw err;
	        console.log("Data Removed");
	        db.close();
	    });
	});	
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
	    dbo.collection("recipes").deleteMany({}, function(err, obj) {
	        if (err) throw err;
	        console.log("Data Removed");
	        db.close();
	    });
	});	
	