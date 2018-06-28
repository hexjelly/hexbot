/* jshint node: true */
'use strict';

// core requires, initialization, connect
var irc = require('irc');
var nconf = require('nconf');
var util = require('util');
var walk = require('walk');
var bot;

process.on('uncaughtException', err => {
  console.log(err);
});

function getConfigFile() {
  var overrideConfig = './config/config.user.json',
    defaultConfig = './config/config.default.json';
  return require('fs').existsSync(overrideConfig) ? overrideConfig : defaultConfig;
}

nconf.file({ file: getConfigFile() });

bot = new irc.Client(
  nconf.get('hexbot').server,
  nconf.get('hexbot').botName,
  nconf.get('irc')
);

// core handlers
bot.on('error', function (message) {
  util.log('Error: ', message);
});

bot.on('registered', function (message) {
  util.log('Success: Connected!');
});

bot.on('message', function (from, to, text) {
  var self = this;
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
          plugin.message.handler({ "result": result, "text": text, "to": to, "from": from, "callback": self });
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
    var walker = walk.walk('./plugins', { followLinks: false });

    walker.on('file', function (root, stat, next) {
      if (stat.name.slice(-3).toLowerCase() === '.js') {
        this.load(stat.name, root + '/' + stat.name);
      }
      next();
    }.bind(this));

    walker.on("end", function () {
      bot.connect();
      util.log('Connecting to %s ...', nconf.get('hexbot').server);
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

bot.plugins.loadAll();
