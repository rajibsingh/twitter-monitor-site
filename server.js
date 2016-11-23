console.log('May Node be with you')

const express = require('express');
const app = express();

app.set('view engine', 'pug')

app.listen(3000, function() {
    console.log('listening on 3000')
})

app.get('/', function (req, res) {
    // console.log(__dirname)
    // response.sendFile(__dirname + '/index.html')

    var MongoClient = require('mongodb').MongoClient, assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/tweetsdb';

    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        db.close();
    });

    res.render('index', { title: 'Hey', message: 'Hello there!' })
})
