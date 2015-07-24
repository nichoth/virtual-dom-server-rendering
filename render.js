var h = require('virtual-dom/h');

module.exports = function(handlers) {

  return function render (state) {
    return h('div', [
      h('h1', 'clicked ' + state.n + ' times'),
      h('button', { onclick: handlers.onclick }, 'click me!')
    ]);
  };

};
