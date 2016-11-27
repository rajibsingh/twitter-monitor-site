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
            console.log(results);
            // ytf do I have to use an index-based for? was using a construct of
            //     for (tweet in tweets)
            // but tweet was just an int of the item's index in the array
            for (i = 0; i < results.length; i++) {
                tweet = results[i];
                console.log("tweet: " + tweet);
                tweets.push(tweet);
            }
            db.close();
            res.render('index', { title: 'Hey', message: 'Hello there!', tweets: tweets })
        });
    });
})

app.get('/detail/:tweetId', function (req, res) {
    var tweetId = req.params.tweetId;
    console.log("tweetId: " + tweetId);

    var MongoClient = require('mongodb').MongoClient , assert = require('assert');
    var tweets = [];
    var url = 'mongodb://localhost:27017/tweetsdb';

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var analysis = "initialized but not set";
        var tweet = "initialized but not set";
        var analysisPromise = db.collection('processed_tweets').findOne({"_id":tweetId});
        console.log("analysisPromise: " + analysisPromise);
        analysis = analysisPromise.then(function (err, val) {
            db.close();
            res.render('detail', {"analysisPromise" : analysis, 'tweet': 'placeholder tweet'});
        })

    });

})
