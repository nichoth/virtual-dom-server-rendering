var ecstatic = require('ecstatic')({root: __dirname + '/public'});
var http = require('http');
var vToHtml = require('vdom-to-html');
var hyperstream = require('hyperstream');
var fs = require('fs');
var path = require('path');
var render = require('./render.js')({});

http.createServer(function(req, res) {

  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(__dirname, 'public/index.html'))
      .pipe( hyperstream({
        '#content': vToHtml( render({n: 0}) )
      }))
      .pipe(res)
    ;
  }
  else {
    ecstatic(req, res);
  }

}).listen(8000);
console.log('listening on :8000');
