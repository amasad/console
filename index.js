var History = require('history');
var Emitter = require('emitter');

var template = require('./template');
var grow = require('grow');
var domify = require('domify');

var lineRe = /\r\n|\r|\n/;

/**
 * @constructor
 */
function Console() {
  this.el = domify(template);
  this.history = new History();
  this.prompt = this.el.querySelector('.prompt');
  this.textarea = this.el.querySelector('textarea');
  grow(this.textarea);
  this.textarea.addEventListener('keydown', this.$keydown.bind(this));
  this.el.addEventListener(
    'click',
    this.textarea.focus.bind(this.textarea, null)
  );
}

Emitter(Console.prototype);

Console.prototype.$allowHistoryUp = function () {
  var n = this.textarea.selectionStart;
  return n <= this.value().split(lineRe)[0].length;
};

Console.prototype.$allowHistoryDown = function () {
  var n = this.textarea.selectionStart;
  var lines = this.value().split(lineRe);
  if (lines.length < 2) return true;
  lines.pop();
  var length = lines.reduce(function (acc, text) {
    return acc + text.length + 1;
  }, 0);
  return n >= length;
};

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
      if (this.$allowHistoryUp()) {
        val = this.history.prev();
        if (val) this.value(val);
        e.preventDefault();
      }
      break;
    case DOWN:
      if (this.$allowHistoryDown()) {
        val = this.history.next();
        if (val) this.value(val);
        e.preventDefault();
      }
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
    this.textarea.setAttribute('rows', s.split(lineRe).length);
    return this;
  } else {
    return this.textarea.value;
  }
};

module.exports = Console;