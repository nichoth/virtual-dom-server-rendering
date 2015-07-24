var ecstatic = require('ecstatic')({root: __dirname + '/public'});
var http = require('http');
var vToHtml = require('vdom-to-html');
var hyperstream = require('hyperstream');
var fs = require('fs');
var path = require('path');
var render = require('./render.js')({});
var JSONGlobals = require('json-globals');

function random() {
  return Math.floor(Math.random() * (50 - 3)) + 3;
}

http.createServer(function(req, res) {

  if (req.url === '/') {
    var state = {n: random()};
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(__dirname, 'public/index.html'))
      .pipe( hyperstream({
        '#bootstrap': JSONGlobals({state: state}),
        '#content': vToHtml( render(state) )
      }))
      .pipe(res)
    ;
  }
  else {
    ecstatic(req, res);
  }

}).listen(8000);
console.log('listening on :8000');
