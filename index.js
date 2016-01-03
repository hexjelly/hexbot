'use strict';

(function init() {
  // core requires, initialization, connect
  var irc = require('irc');
  var nconf = require('nconf');
  nconf.file({file: getConfigFile()});

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

  // load plugins
  bot.use = function use (plugin) {
    plugin(bot, nconf);
  };

  bot.loadPlugins = function loadPlugins() {
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
  };

  bot.loadPlugins();

})();
