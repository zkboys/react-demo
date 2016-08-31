var express = require('express');
var app = express();
var path = require('path');
var swig = require('swig');
var routes = require('./routes');
var siteRootPath = __dirname;
var viewsPath = path.join(siteRootPath, '../dist');
var staticPath = path.join(siteRootPath, '../dist');
var proxyMiddleware = require('http-proxy-middleware')
var config = require('../build/config')
var proxyTable = config.dev.proxyTable
var port = process.env.PORT || 7000;

// view engine setup
app.set('views', viewsPath);
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// Swig will cache templates for you, but you can disable that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({cache: false});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {target: options}
        options.changeOrigin = true;
    }
    app.use(proxyMiddleware(context, options))
})


// static files setup
app.use(express.static(staticPath, {maxAge: 60 * 60 * 24 * 365 * 10, etag: true, lastModified: true}));

// router setup
app.use('/', routes);

// run the server
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
