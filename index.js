var History = require('history');
var Emitter = require('emitter');

var template = require('./template');
var grow = require('grow');
var domify = require('domify');

/**
 * @constructor
 */
function Console() {
  this.el = domify(template);
  this.prompt = this.el.querySelector('.prompt');
  this.textarea = this.el.querySelector('textarea');
  grow(this.textarea);
  this.textarea.addEventListener('keydown', this.$keydown.bind(this));
  this.textarea;
  this.history = new History();
}

Emitter(Console.prototype);

var UP = 38;
var DOWN = 40;
var ENTER = 13;
/**
 * @param {Event} e
 */
Console.prototype.$keydown = function (e) {
  var val;
  switch (e.keyCode) {
    case UP:
      val = this.history.prev();
      if (val) this.value(val);
      e.preventDefault();
      break;
    case DOWN:
      val = this.history.next();
      if (val) this.value(val);
      e.preventDefault();
      break;
    case ENTER:
      if (!e.shiftKey) {
        this.$enter();
        e.preventDefault();
      } else {
        return true;
      }
      break;
    default:
      return;
  }
};

Console.prototype.log = function(val, klass) {
  var el = domify('<pre>' + val + '</pre>');
  if (klass) el.classList.add(klass);
  this.el.insertBefore(el, this.prompt);
};

Console.prototype.result = function (val) {
  this.log(val, 'result');
};

Console.prototype.$enter = function () {
  var val = this.value();
  this.log(
    '<span class="chevron">&#8250;</span><span class="val">' + val + '</span>',
    'old-prompt'
  );
  this.emit('command', val);
  this.history.add(val);
  this.value('');
};

Console.prototype.value = function (s) {
  if (typeof s === 'string') {
    this.textarea.value = s;
    return this;
  } else {
    return this.textarea.value;
  }
};

module.exports = Console;