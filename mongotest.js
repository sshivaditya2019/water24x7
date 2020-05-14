var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:Aditya%4026@dbms-fwfnu.mongodb.net/water";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("water");
    var query = { YEAR_OBS: "2012" };
    dbo.collection("Alanganallur").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});