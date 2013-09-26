ComnerJs
========

Command line utils for node.

### Current functionalities
* Message dispatcher

### Planned functionalities
* Arguments parser

Usage
-------

### Installing

``` npm install comner ```

### Creation and configuration

```javascript
var ComnerJs = require("comnerjs");
//...
var dispatcher = new ComnerJs.ConsoleDispatcher({
  in: process.stdin,
  processor: function(str){
    return str.trim();
  }
});
dispatcher.add(/\w+Hello/i, function(){
  console.log("Did you say hello? Was it for me?");
});
dispatcher.add(/^Hello, ConsoleDispatcher[\.|\!]/i, function(message, regex){
  console.log("Hello, I'm ConsoleDispatcher and I'm here to dispatch messages that you send to me.");
  that.skip();
});
dispatcher.add(/^Hello, (\w*)/i, function(message, regex){
  var name = regex.exec(message)[1];
  console.log("Hello. But I'm not "+name);
});
```

License
-------
[MIT](https://github.com/ruipgil/ComnerJs/blob/master/LICENSE) license.