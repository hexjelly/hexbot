'use strict';

(function init() {
  // core requires, initialization, connect
  var irc = require('irc');
  var nconf = require('nconf');
  var util = require('util');
  nconf.file({ file: getConfigFile() });

  function getConfigFile() {
    var overrideConfig = './config/config.user.json';
    var defaultConfig = './config/config.default.json';
    return require('fs').existsSync(overrideConfig) ? overrideConfig : defaultConfig;
  }


  var bot = new irc.Client(
    nconf.get('hexbot').server,
    nconf.get('hexbot').botName,
    nconf.get('irc')
  );

  bot.setMaxListeners(20);

  util.log('Connecting to %s ...', nconf.get('hexbot').server);

  // core handlers
  bot.on('error', function (message) {
    util.log('Error: ', message);
  });

  bot.on('registered', function (message) {
    util.log('Success: Connected!');
  });

  bot.on('message', function (from, to, text) {
    var self = this;
    for (var key in self.plugins.list) {
      var plugin = self.plugins.list[key];
      if (plugin.message) {
        var regex = plugin.message.regex;
        var result = regex.exec(text);
        if (result) {
          if (to === self.nick) { // pm instead of channel
            to = from;
          }
          try {
            plugin.message.handler({ "result": result, "text": text, "to": to, "from": from, "callback": function (result) {
              self.say(to, result);
            }});
          } catch (err) {
            util.log("Plugin '" + key + "' error: " + err);
          }
        }
      }
    }
  });

  // plugins
  bot.plugins = {
    "list": {},
    "load": function (name, plugin) {
      try {
        this.list[name] = require(plugin);
      } catch (err) {
        util.log('Plugin loading error: ' + err);
      }
    },
    "loadAll": function () {
      var self = this;
      var walk = require('walk');
      var walker = walk.walk('./plugins', { followLinks: false });

      walker.on('file', function (root, stat, next) {
        if (stat.name.slice(-3).toLowerCase() === '.js') {
          self.plugins.load(stat.name, require(root + '/' + stat.name));
        }
        next();
      });
    },
    "unload": function (plugin) {
      // unload plugin
    },
    "unloadAll": function () {
      // unload all plugins (?! eh)
    }
  };

  // testing plugin handlers
  bot.plugins.load('calc.js', './plugins/calc.js');
  bot.plugins.load('currency.js', './plugins/currency.js');
  bot.plugins.load('dictionary.js', './plugins/dictionary.js');
  util.log(bot.plugins.list);

})();
