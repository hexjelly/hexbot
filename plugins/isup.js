/* Check if website is up */

'use strict';

function init (bot) {
  // extremely naive barebones check of URI as we're passing it to request module anyway
  // basically just checks if anything matches *.* with optional http or https infront and ignores missing : or / characters
  var regex = /^!isup\s+(?:https|http)?(?:\:|\/)*(.+\..+)/i;

  bot.on('message', function(from, to, text) {
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    var result = regex.exec(text);
    if (result) {
      isUp(result[1], to);
    }
  });

  function isUp(url, to) {
    var request = require('request');
    var testURI = 'http://' + url;

    request(testURI, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        bot.say(to, testURI + ' seems to be up!');
      } else {
        bot.say(to, testURI + ' is down for me as well');
      }
    });
  };
};

module.exports = init;
