var main = require('main-loop');
var virtualize = require('vdom-virtualize');
var state = {n: 0};
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

