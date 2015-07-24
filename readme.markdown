# virtual-dom with server side rendering

[virtual-dom](https://npmjs.com/package/virtual-dom) demo using the same rendering logic on client and server.

See https://github.com/Raynos/mercury/issues/55

[view the starter demo](http://substack.neocities.org/virtual_dom_starter.html)

See https://github.com/Raynos/mercury/issues/55

See the [virtualize branch](https://github.com/nichoth/virtual-dom-server-rendering/tree/virtualize) for an example of serializing initial state on the server and including it with the html.

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
var state = {n: 0};
var render = require('../render.js')({
  onclick: function() {
    state = {n: state.n+1};
    loop.update(state);
  }
});
var loop = main(state, render, {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
});

var root = document.getElementById('content');
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

http.createServer(function(req, res) {

  // create vtree then turn it into a string
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
