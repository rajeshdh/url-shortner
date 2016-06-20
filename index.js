var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var validator = require('validator');
var path = require('path');
var Url = require('./url-model');
var config = require('./config');


var app = express();
app.set('port', (process.env.PORT || 1337));
app.set('db', config.database);


mongoose.connect(app.get('db'), function(err, db) {
    if (err) {
        console.error('Database connection failed');
    } else {
        console.log('Database connected!!')
    }
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/:url', function(req, res) {
  var url = req.params.url;
  Url.findOne({
    'shortId':url
  },function (err, result) {
    if(err) {
      res.send({'Error': 'Cannot find the requested URL'});
    }
    if (result) {
      res.redirect(result.baseUrl);
    } else {
      res.send({'Error': 'Cannot find the requested URL'});
    }

  })

})
app.get('/new', function(req, res) {
    res.send({
        error: 'no url entered'
    });
});
app.get('/new/:url/*', function(req, res) {
    var baseUrl = req.url.slice(5);
    var host = req.get('host');

    if (validator.isURL(baseUrl)) {
        Url = mongoose.model('Url');
        var url = new Url({
            baseUrl: baseUrl
        });
        url.save(function(err) {
            if (err) {
                return res.status(400);
            } else {
                res.send({
                  'original_url': baseUrl,
                  'short_url': host + '/' + url.shortId
                });
            }
        })
    } else {
        res.send({
            error: 'invalid url'
        });
    }


})

app.listen(app.get('port'), function() {
    console.log('App is running on ', app.get('port'));
});
