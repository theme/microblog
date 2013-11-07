/**
 * Module dependencies.
 */

var express = require('express');
var engine = require('ejs-locals');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');

var app = express();
app.engine('ejs', engine);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// cookie support
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({   //session support
    cookie: {maxAge: 60000},
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.user= req.session.user;
    res.locals.error= req.flash('error');   //flash message support
    res.locals.success= req.flash('success');
    next();
});

//app.use(express.router(routes));
app.use(app.router);
routes(app);

// served static files. e.g. x.js
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// run server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

