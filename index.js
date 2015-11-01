'use strict';

// core requires, initialization, connect
var irc = require('irc');
var nconf = require('nconf');
nconf.file({file: 'config/config.default.json'});
nconf.defaults({});

var bot = new irc.Client(
  nconf.get('hexbot').server,
  nconf.get('hexbot').botName,
  nconf.get('irc')
);

console.log('connecting to %s ...', nconf.get('hexbot').server);

// core handlers
bot.on('error', function (message) {
  console.log('error: ', message);
});

bot.on('registered', function (message) {
  console.log('connected!');
});


// load plugins
