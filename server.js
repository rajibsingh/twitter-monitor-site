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
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})
