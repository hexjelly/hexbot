'use strict';

(function init() {
  // core requires, initialization, connect
  var irc = require('irc');
  var nconf = require('nconf');
  var util = require('util');
  var walk = require('walk');
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
        util.log("Plugin '" + name + "' loaded");
      } catch (err) {
        util.log('Plugin loading error: ' + err);
      }
    },
    "loadAll": function () {
      var self = this;
      var walker = walk.walk('./plugins', { followLinks: false });

      walker.on('file', function (root, stat, next) {
        if (stat.name.slice(-3).toLowerCase() === '.js') {
          self.load(stat.name, root + '/' + stat.name);
        }
        next();
      });
    },
    "unload": function (plugin) {
      delete this.list[plugin];
      util.log("Plugin '" + plugin + "' unloaded");
    },
    "unloadAll": function () {
      for (var plugin in this.list) {
        this.unload(plugin);
      }
    }
  };

  // testing plugin handlers
  bot.plugins.loadAll();

})();
