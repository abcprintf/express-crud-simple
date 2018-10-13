var config = require('./config');

var url = config.urlDB;
var dbname = config.dbName;
var MongoClient = require('mongodb').MongoClient;

exports.exc = function (obj, fn){
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function(err, db) {
        var dbo = db.db(dbname);
        var collection = obj.c;

        var fnArrayQ = function (w2, f2, o2, fn2) {
            dbo.collection(collection).find(w2, f2).limit(o2.limit).skip(o2.skip).toArray(function (err, results) {
                return (fn2)((typeof (results) === "undefined" ? [] : results), err);
            });
        };

        if(obj.m === "sObjId"){
            var ObjectId = require('mongodb').ObjectID;
            dbo.collection(obj.c).find({
                _id: ObjectId(obj.v)
            }).toArray(function (err, results) {
                db.close();
                return (fn)((typeof (results) === "undefined" ? [] : results), err);
            });
        }else if(obj.m === "s"){
            dbo.collection(obj.c).find(obj.w).toArray(function (err, results) {
                db.close();
                return (fn)((typeof (results) === "undefined" ? [] : results), err);
            });
        }else if(obj.m === "i"){
            dbo.collection(obj.c).insertOne(obj.w, function (err, res) {
                db.close();
                var errs = (!err ? true : false);
                return (fn)({
                    status: errs,
                    msg: err
                });
            });
        }else if(obj.m === "uObjId"){
            var ObjectID = require('mongodb').ObjectID;
            dbo.collection(obj.c).updateOne({
                _id: ObjectID(obj.v)
            },{
                $set: obj.w
            }, function(err, res) {
                db.close();
                var errs = (!err ? true : false);
                return (fn)({
                    status: errs,
                    msg: err
                });
            });
        }
    });
}