# console

  textarea-based browser console, similar to chrome dev tools.

  ![demo](https://i.cloudup.com/SN8xtTF0Eh.png)

## Installation

  Install with [component(1)](http://component.io):

    $ component install amasad/console

## Usage

```js
var Console = require('console');
var konsole = new Console();

konsole.on('command', function (val) {
  var result = eval(val);
  this.result(result);
});

konsole.log('started');
```

## API

### new Console()

`console.el` will contain the console container element. Use to append, style, etc.

## Console#log(val, classname)

logs to the console right before the prompt element with the passed classname.

## Console#result

like log but with preset styles. See css file.

## Events

  `command` with the value.

## License

  MIT
