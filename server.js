/* server.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
//Define the var
var http = require('http');
var path = require('path');
var fs = require("fs");
//APIs function
var mime = require("mime");
var urlH = require("url");
var qs = require('querystring');
//APIs function
var formidable = require('formidable'); 
var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb://localhost:27017/"; 
http.createServer(function(req, res) {

	res.render = function(filename) {
		fs.readFile(filename, function(err, data) {
			if (err) {
				res.writeHead(404);
				res.write("404 Not Found"); 
			} else {
				res.setHeader('Content-Type', mime.getType(filename));
				res.write(data);
			}
			res.end();
		});
	}
	var url = req.url.toLocaleLowerCase();
	var method = req.method.toLowerCase();
	console.log(url)
	
	if (url.startsWith("/login")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'views', 'login.html'));
		} else if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				var username = postBody.username;
				var password = postBody.password;
				console.log(postBody);
				findUser(postBody, res);
			});
		}
	} else if (url.startsWith("/index")) {
		res.render(path.join(__dirname, 'views', 'index.html'));
	}else if (url.startsWith("/fav")) {
		res.render(path.join(__dirname, 'views', 'fav.html'));
	}else if (url.startsWith("/register")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'views', 'register.html'));
		} else if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				insertNewUser(postBody, res);
			});
		}
	} else if (url.startsWith("/findbyusername")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				findUserByUserName(postBody, res);
			});
		}
	} else if (url === '/initcategory' && method === 'get') {
		initCategory(res);
	} else if (url.startsWith('/initrecipes') && method === 'get') {
		var parseObj = urlH.parse(req.url, true);
		initRecipes(parseObj, res);
	} else if (url.startsWith('/index') && method === 'get') {
		res.render(path.join(__dirname, 'views', 'index.html'));
	}else if (url.startsWith('/detail') && method === 'get') {
		res.render(path.join(__dirname, 'views', 'detail.html'));
	} else if (url.startsWith("/addnewrecipes") && method === 'post') {
		var form = new formidable.IncomingForm();
		var targetFile = path.join(__dirname, './resources/img');
		form.uploadDir = targetFile;
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
			var oldpath = files.uploadImg.path;

			var newpath = path.join(path.dirname(oldpath), files.uploadImg.name);
			fs.rename(oldpath, newpath, (err) => {
				if (err) throw err;
				var imgSrc = "/resources/img/" + files.uploadImg.name;
				var data = {
					name: fields.name,
					categoryName: fields.categoryName,
					imgSrc: imgSrc,
					formula: fields.formula,
					activeTime: fields.activeTime,
					totalTime: fields.totalTime,
					yield: fields.yield,
					postBy: fields.postBy
				};
				insertRecipes(data, res);
			})
		});
	} else if (url.startsWith("/addnewcategoryaction")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				var data = { name: postBody.name};
				insertCategory(data, res);
			});
		}
	}
		else if (url.startsWith("/addnewsubscribeaction")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				var data = { name: postBody.name};
				insertSubscribe(data, res);
			});
		}
	} else if (url.startsWith("/resources") && method === 'get') {
		res.render(path.join(__dirname, url));
	} else if(url.startsWith("/decategory") && method === 'delete')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { name: postBody.name};
			console.log(data);
			delCategory(data, res);
		});
	
	}else if(url.startsWith("/delrecipes") && method === 'delete')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { name: postBody.name,categoryName:postBody.categoryName};
			console.log(data);
			delRecipes(data, res);
		});
	
	}else if(url.startsWith("/updatecategoryaction") && method === 'put')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			
			console.log(postBody);
			updateCategory(postBody, res);
		});
	
	}
	else if(url.startsWith("/updatepassword") && method === 'put')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			
			console.log(postBody);
			updatePassword(postBody, res);
		});
	
	}
	else if(url.startsWith("/initdeatil") && method === 'post')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			
			console.log(postBody);
			findRecipesByName(postBody, res);
		});
	
	}
	else if(url.startsWith("/findfavoritebyusername") && method === 'post')
	{
		console.log("123123123")
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			findFavByUserName(postBody, res);
		});
	}
	else if(url.startsWith("/addfavorite") && method === 'post')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { username:postBody.username,recipesId:postBody.recipesId};
			console.log(postBody);
			insertFavorite(postBody, res);
		});
	
	}else if(url.startsWith("/isfavorite") && method === 'post')
	{
		console.log("Entry..");
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { username:postBody.username,recipesId:postBody.recipesId};
			console.log(postBody);
			findFavorite(postBody, res);
		});
	
	}	else if(url.startsWith("/removefavorite") && method === 'post')
	{
		var array = [];
		req.on('data', function(chunk) {
			array.push(chunk);
		});
		req.on('end', function() {
			var postBody = Buffer.concat(array);
			postBody = postBody.toString("utf8");
			postBody = qs.parse(postBody);
			var data = { username:postBody.username,recipesId:postBody.recipesId};
			console.log(postBody);
			delFavorite(postBody, res);
		});
	
	}
	else {
		console.log("Requested URL is: " + req.url);
		res.end();
	}
}).listen(8964, function() { //Port no 8964
	console.log("304CEM PT11 197370593 v2 - Started");
})


function findUser(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		var whereStr = {
			"username": data.username,
			'password': data.password
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			 console.log(result);
			if (result.length == 1) {
				res.end("success");
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}

function insertNewUser(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("users").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}

function findUserByUserName(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		var whereStr = {
			"username": data.username
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			
			if (result.length <= 0) {
				res.end("success");
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}
function findRecipesByName(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		var whereStr = {
			"name": data.name
		};
		console.log( data.name);
		dbo.collection("recipes").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
		
				res.end(JSON.stringify(result));
		
		
			db.close();
		});
	});
}
function initCategory(res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("category").find({}).toArray(function(err, result) { 
			if (err) throw err;
			
			res.end(JSON.stringify(result));
			db.close();
		});
	});
}

function initRecipes(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		var whereStr = {
			"categoryName": data.query.categoryName
		};
		dbo.collection("recipes").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			res.end(JSON.stringify(result));
			db.close();
		});
	});
}

function insertRecipes(data, res) {
	var uuid=guid();
	data.uuid=uuid;
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("recipes").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}

function insertCategory(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("category").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function insertSubscribe(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("subscribe").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}

function delCategory(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
		var data1 = {'name':data.name};
		console.log(data1)
	    dbo.collection("category").deleteOne(data1, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}
function delRecipes(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
	    dbo.collection("recipes").deleteOne(data, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}
function updateCategory(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
		console.log("data:"+data.oldName);
	    var dbo = db.db("vtc304");
	    var whereStr = {"name":data.oldName};  
	    var updateStr = {$set: { "name" : data.name }};
	    dbo.collection("category").updateOne(whereStr, updateStr, function(err, obj) {
	       if (err) throw err;
	       res.end("success");
	       db.close();
	    });
	});
}
function updatePassword(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
		console.log("data:"+data.oldName);
	    var dbo = db.db("vtc304");
	    var whereStr = {"username":data.username}; 
	    var updateStr = {$set: { "password" : data.password }};
	    dbo.collection("users").updateOne(whereStr, updateStr, function(err, obj) {
	       if (err) throw err;
	       res.end("success");
	       db.close();
	    });
	});
}

function insertFavorite(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		dbo.collection("favicate").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function delFavorite(data, res) {
	console.log("delFavorite");
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("vtc304");
	    dbo.collection("favicate").deleteOne(data, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});

}

function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function findFavorite(data, res) {
MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("vtc304");
		var whereStr = {
			"username": data.username,
			"recipesId": data.recipesId,
		};
		dbo.collection("favicate").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
				res.end(JSON.stringify(result));
			db.close();
		});
	});
}
function findFavByUserName(data, res)
{
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("vtc304");
	  dbo.collection('favicate').aggregate([
	    { $lookup:
	       {
	         from: 'recipes',            
	         localField: 'recipesId',   
	         foreignField: 'uuid',       
	         as: 'recipes'
	       }
	     }
	    ]).toArray(function(err, result) {
	    if (err) throw err;
		var arr = [];
		console.log(JSON.stringify(result))
		for(var i=0;i<result.length;i++)
		{
			if(result[i].username==data.username)
			{
				arr.push(result[i].recipes);
			}
		}
		res.end(JSON.stringify(arr));
	    
		console.log(JSON.stringify(arr))
		db.close();
	  });
	});
}


