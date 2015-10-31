/*jslint node: true */
'use strict';


/* core requires, initialization, connect */
var irc = require('irc');
var nconf = require('nconf');

nconf.file({file: 'config/config.default.json'});
nconf.defaults({});

var bot = new irc.Client(nconf.get('server'), nconf.get('botName'), { channels: nconf.get('channels'), floodProtection: true });


/* load plugins */
