var express = require("express");
var bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:Aditya%4026@dbms-fwfnu.mongodb.net/water"
MongoClient.connect(uri, function(err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
    console.log('Connected...');
    const collection = client.db("test").collection("devices");
    client.close();
});
var name = ""
var water = 0
var opwlc = 0
var opwlcodeuni = []
var app = express()
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.render(__dirname + '/views/index.ejs');
})

app.post('/water', function(req, res) {
    name = req.body.city;
    water = req.body.water;

    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var opwlcode = []
        var new1 = ""
        var oplat = []
        var oplon = []
        var colname = []
        var opsitename = []
        var dbo = db.db("water");
        /*dbo.listCollections().toArray(function(err, collections){
            var stringify1 = JSON.stringify(collections)
            content = JSON.parse(stringify1);
            content.forEach(function(result){
                new1 = result.name
                new1 = new1.replace('\t','');
                new1 = new1.replace(' \t','');
                console.log(new1)
                colname.push(new1)
            });
        
        });
        */
        var query = { NAMES: name };
        dbo.collection("main").find(query).project().toArray(function(err, docs) {
            if (err) throw err;
            var stringify = JSON.stringify(docs)
            content = JSON.parse(stringify);
            content.forEach(function(result) {
                if (water <= 70) {
                    opwlc = result.PREMON;
                } else if (water >= 120) {
                    opwlc = result.MONSOON;
                } else {
                    if (result.POMRB > result.POMKH) {
                        opwlc = result.POMRB;
                    } else {
                        opwlc = result.POMKH;
                    }
                }

            })
        });
        dbo.collection(name).find().project().toArray(function(err, docs) {
            console.log("Found the following records");
            var stringify = JSON.stringify(docs)
            content = JSON.parse(stringify);
            content.forEach(function(result) {
                opwlcode.push(result.WLCODE);
                const newLocal = '﻿LAT';
                oplat.push(result[newLocal]);
                oplon.push(result.LON);
                opsitename.push(result.SITE_NAME);
            })
            opwlcodeuni = opwlcode.filter(function(elem, pos) {
                return opwlcode.indexOf(elem) == pos;
            })
            oplatuni = oplat.filter(function(elem, pos) {
                return oplat.indexOf(elem) == pos;
            })
            oplonuni = oplon.filter(function(elem, pos) {
                return oplon.indexOf(elem) == pos;
            })
            opsitenameuni = opsitename.filter(function(elem, pos) {
                    return opsitename.indexOf(elem) == pos;
                })
                /*console.log(opwlcodeuni)
                console.log(oplatuni)
                console.log(oplonuni)
                console.log(opsitenameuni)
                console.log(opwlc)*/
            res.render(__dirname + '/views/water.ejs', { number: opwlc, rain: water, city: name });
            db.close();
        });

    });


});


app.listen(process.env.PORT || 5000, () => {
    console.log("Server AT 3000")
})