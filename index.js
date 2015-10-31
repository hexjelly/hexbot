/*jslint node: true */
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


// error handler
bot.addListener('error', function(message) {
    console.log('error: ', message);
});


// load plugins
