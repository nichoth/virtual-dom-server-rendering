# virtual-dom with server side rendering

[virtual-dom](https://npmjs.com/package/virtual-dom) demo using the same rendering logic on client and server.

[view the starter demo](http://substack.neocities.org/virtual_dom_starter.html)

See https://github.com/Raynos/mercury/issues/55

This version serializes the inital state from the server and sends it to the client using `json-globals`.

# quick start

```
$ npm run dev
```

# commands

* `npm run build` - build js for production
* `npm run watch` - automatically build js on file changes for development
* `npm start` - start a development server

# client code

``` js
var main = require('main-loop');
var virtualize = require('vdom-virtualize');
var JSONGlobals = require('json-globals/get');
var state = JSONGlobals('state');
var render = require('../render.js')({
  onclick: function() {
    state = {n: state.n+1};
    loop.update(state);
  }
});

var root = document.getElementById('content');
var serverTree = virtualize(root.firstChild);
var clientTree = render(state);

var patch = require('virtual-dom/patch');
var diff = require('virtual-dom/diff');

var loop = main(state, render, {
  create: require('virtual-dom/create-element'),
  diff: diff,
  patch: patch,
  initialTree: serverTree,
  target: patch(root.firstChild, diff(serverTree, clientTree))
});

root.innerHTML = '';
root.appendChild(loop.target);

```

# Server

```js
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
```

# render.js

```js
var h = require('virtual-dom/h');

module.exports = function(handlers) {

  return function render (state) {
    return h('div', [
      h('h1', 'clicked ' + state.n + ' times'),
      h('button', { onclick: handlers.onclick }, 'click me!')
    ]);
  };

};
```

# contributing

If you like what you see, but want to add something more, fork this repo and add
your additional feature to the name of the fork. Try to be specific with the
name of your fork, listing the technologies used plus what features the fork
adds.

# variations

Check out the [list of forks](https://github.com/substack/virtual-dom-starter/network/members)
to see how other people have customized this starter repo.
