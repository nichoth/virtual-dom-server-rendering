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

