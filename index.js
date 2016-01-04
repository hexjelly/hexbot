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

  console.log('connecting to %s ...', nconf.get('hexbot').server);

  // core handlers
  bot.on('error', function (message) {
    console.log('error: ', message);
  });

  bot.on('registered', function (message) {
    console.log('connected!');
  });

  bot.on('message', function (from, to, text) {
    for (var key in this.plugins.list) {
      var plugin = this.plugins.list[key];
      if (plugin.message) {
        var regex = plugin.message.regex;
        var result = regex.exec(text);
        if (result) {
          if (to === this.nick) { // pm instead of channel
            to = from;
          }
          try {
            plugin.message.handler({ "result": result, "text": text, "to": to, "from": from, "callback": function (result) {
              bot.say(to, result);
            }});
          } catch (err) {
            util.log(err);
          }
        }
      }
    }
  });

  // plugins
  bot.plugins = {
    "list": {},
    "load": function (name, plugin) {
      this.list[name] = plugin;
    },
    "loadAll": function () {
      var walk = require('walk');
      var walker = walk.walk('./plugins', { followLinks: false });

      walker.on('file', function (root, stat, next) {
        if (stat.name.slice(-3) === '.js') {
          console.log('loading plugin %s/%s', root, stat.name);
          try {
            bot.use(require(root + '/' + stat.name));
          } catch (err) {
            console.error(err);
          }
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

  // just testing
  bot.plugins.load('calc', require('./plugins/calc.js'));
  console.log(bot.plugins.list);

})();
