const express = require('express');
const app = express();

app.set('view engine', 'pug')
app.set('views', __dirname + '/public/views');
app.use(express.static('public'))

app.listen(3000, function() {
    console.log('listening on 3000')
})

app.get('/', function (req, res) {
    var MongoClient = require('mongodb').MongoClient , assert = require('assert');
    var tweets = [];
    var url = 'mongodb://localhost:27017/tweetsdb';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var col = db.collection('tweets').find().toArray(function(err, results) {
            // ytf do I have to use an index-based for? was using a construct of
            // for (tweet in tweets) but tweet was just an int of the item's index in the array
            for (i = 0; i < results.length; i++) {
                var tweet = results[i];
                //massage the creation timestring from twitter which doesn't parse cleanly for js date
                var creationDateStr = tweet["created_at"];
                creationDateStr = creationDateStr.substring(3,16) + " " + creationDateStr.substring(26);
                console.log("creationDateStr: " + creationDateStr);
                var moment = require('moment');
                creationDate = new moment(creationDateStr);
                console.log("creationDate: " + creationDate);
                tweet["created_at"] = creationDate;
                tweets.push(tweet);
            }
            db.close();
            res.render('index', { title: 'Twitter Monitor', tweets: tweets })
        });
    });
})

app.get('/detail/:tweetId', function (req, res) {
    var tweetStr = req.params.tweetId;
    var tweetId = parseInt(tweetStr);
    console.log("tweetId: " + tweetId);

    var MongoClient = require('mongodb').MongoClient , assert = require('assert');
    var url = 'mongodb://localhost:27017/tweetsdb';

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log(err);
        var tweetPromise = db.collection('tweets').findOne({"_id" : tweetId});
        tweetPromise.then(function (result) {
            tweet = result;
            var analysisPromise = db.collection('processed_tweets').findOne({"_id":tweetId});
            analysisPromise.then(function (result) {
                console.log("result: " + result);
                db.close();
                res.render('detail', { layout : 'detail', tweet: tweet, analysis: result});
            }, function(err) {
                console.log("failed to retrieve tweet: " + tweetId);
                console.log(("err: ") + err);
            });
        }, function(err) {
            console.log("failed to retrieve tweet: " + tweetId);
            console.log("err: " + err);
        });
    });
})
